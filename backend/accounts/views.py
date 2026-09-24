from django.db import transaction
from django.db.models import Q
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenRefreshView

from .authentication import StudentJWTAuthentication, blacklist_refresh, issue_tokens, verify_password
from .email_service import EmailDeliveryError, email_configured, send_password_reset_email
from .models import Student
from .serializers import (
    LoginSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RefreshTokenSerializer,
    RegisterSerializer,
    public_student,
)
from .tokens import default_token_generator
from .validators import normalize_email, normalize_mobile


def _first_error(serializer):
    for _field, errors in serializer.errors.items():
        if isinstance(errors, (list, tuple)):
            return str(errors[0])
        if isinstance(errors, dict):
            for _k, v in errors.items():
                return str(v[0]) if isinstance(v, (list, tuple)) else str(v)
    return 'Invalid request.'


class RegisterView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = 'register'

    @transaction.atomic
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'error': _first_error(serializer)}, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        email = normalize_email(data['email'])
        mobile = normalize_mobile(data['mobile'])

        if Student.objects.filter(email=email).exists():
            return Response(
                {'success': False, 'error': 'An account with this email already exists. Please log in instead.'},
                status=status.HTTP_409_CONFLICT,
            )
        if Student.objects.filter(mobile=mobile).exists():
            return Response(
                {'success': False, 'error': 'An account with this mobile number already exists. Please log in instead.'},
                status=status.HTTP_409_CONFLICT,
            )

        student = Student(
            full_name=data['full_name'],
            mobile=mobile,
            email=email,
            college=data.get('college', ''),
            course=data.get('course', ''),
            branch=data.get('branch', ''),
            year=data.get('year', ''),
            gender=data.get('gender', ''),
            budget=data.get('budget', ''),
            preferred_room_type=data.get('preferred_room_type', ''),
            mother_name=data.get('mother_name', ''),
            father_name=data.get('father_name', ''),
            parent_phone=normalize_mobile(data.get('parent_phone')) or '',
            email_verified=True,
            mobile_verified=True,
            is_active=True,
        )
        student.set_password(data['password'])
        student.save()

        tokens = issue_tokens(student)
        return Response(
            {'success': True, 'message': 'Account created successfully.', **tokens},
            status=status.HTTP_201_CREATED,
        )


class LoginView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = 'login'

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'error': _first_error(serializer)}, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        email = normalize_email(data.get('email'))
        mobile = normalize_mobile(data.get('mobile'))
        password = data.get('password')

        query = Q()
        if email:
            query |= Q(email=email)
        if mobile:
            query |= Q(mobile=mobile)
        if not query:
            return Response({'success': False, 'error': 'Email or mobile number is required.'}, status=status.HTTP_400_BAD_REQUEST)

        student = Student.objects.filter(query).first()
        if not student or not password or not verify_password(student, password):
            return Response({'success': False, 'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        if not student.is_active:
            return Response({'success': False, 'error': 'Your account is not active.'}, status=status.HTTP_403_FORBIDDEN)

        tokens = issue_tokens(student)
        return Response({'success': True, **tokens})


class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetRequestSerializer
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = 'reset'

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'error': _first_error(serializer)}, status=status.HTTP_400_BAD_REQUEST)

        email = normalize_email(serializer.validated_data['email'])
        student = Student.objects.filter(email=email).first()
        if not student:
            # Always answer the same way to avoid revealing which emails are registered.
            return Response({'success': True, 'message': 'If an account exists for this email, reset instructions are on their way.'})

        if not email_configured():
            return Response(
                {
                    'success': False,
                    'error': 'Password reset email is not configured on the server yet '
                    '(set EMAIL_HOST_USER / EMAIL_HOST_PASSWORD in backend/.env).',
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        uidb64 = urlsafe_base64_encode(force_bytes(student.pk))
        token = default_token_generator.make_token(student)
        from django.conf import settings

        frontend = settings.FRONTEND_URL.rstrip('/')
        reset_link = f'{frontend}/reset-password?uidb64={uidb64}&token={token}'

        try:
            send_password_reset_email(email, student.full_name, reset_link)
        except EmailDeliveryError as err:
            return Response({'success': False, 'error': str(err)}, status=status.HTTP_502_BAD_GATEWAY)

        return Response({'success': True, 'message': 'Password reset instructions have been sent to your email.'})


class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetConfirmSerializer
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = 'reset'

    @transaction.atomic
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'error': _first_error(serializer)}, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        try:
            uid = force_str(urlsafe_base64_decode(data['uidb64']))
            student = Student.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Student.DoesNotExist):
            return Response({'success': False, 'error': 'The reset link is invalid.'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(student, data['token']):
            return Response(
                {'success': False, 'error': 'The reset link is invalid or has expired. Please request a new one.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        student.set_password(data['new_password'])
        student.is_active = True
        student.save(update_fields=['password', 'is_active', 'updated_at'])

        return Response({'success': True, 'message': 'Your password has been reset. Please log in with your new password.'})


class RefreshTokenView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'error': _first_error(serializer)}, status=status.HTTP_401_UNAUTHORIZED)
        result = serializer.validated_data
        result['success'] = True
        return Response(result)


class MeView(generics.GenericAPIView):
    authentication_classes = (StudentJWTAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request):
        return Response({'success': True, 'user': public_student(request.user)})


class LogoutView(generics.GenericAPIView):
    authentication_classes = (StudentJWTAuthentication,)
    permission_classes = (AllowAny,)
    serializer_class = RefreshTokenSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            blacklist_refresh(serializer.validated_data['refresh'])
        return Response({'success': True, 'message': 'Logged out successfully.'})