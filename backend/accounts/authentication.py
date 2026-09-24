from django.contrib.auth.hashers import check_password
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from .models import Student
from .serializers import public_student


def issue_tokens(student):
    """Create access + rotate-able refresh tokens carrying the student id/role."""
    refresh = RefreshToken()
    refresh['user_id'] = student.id
    refresh['role'] = student.role
    access = refresh.access_token
    access['role'] = student.role
    return {
        'access': str(access),
        'refresh': str(refresh),
        'user': public_student(student),
    }


def verify_password(student, password):
    return bool(student and login_password_allowed(student) and check_password(password or '', student.password))


def login_password_allowed(student):
    return bool(student.password)


def blacklist_refresh(refresh_token: str):
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
    except Exception:
        # Invalid/already blacklisted tokens should never block logout.
        pass


class StudentJWTAuthentication(JWTAuthentication):
    """JWT auth that resolves the subject to a Student (not Django's auth User)."""

    def get_user(self, validated_token):
        user_id = validated_token.get('user_id')
        if user_id is None:
            raise AuthenticationFailed('Token contains no identifiable user.', code='user_not_found')
        try:
            user = Student.objects.get(pk=user_id)
        except Student.DoesNotExist:
            raise AuthenticationFailed('User not found.', code='user_not_found') from None
        if not user.is_active:
            raise AuthenticationFailed('Your account is not active.', code='user_inactive')
        return user


def decode_access_token(token):
    """Return the validated AccessToken (used for optional-auth endpoints)."""
    try:
        return AccessToken(token)
    except Exception:
        return None