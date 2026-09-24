from rest_framework import serializers

from .models import Student
from .validators import normalize_email, normalize_mobile, validate_email, validate_mobile, validate_password


def public_student(student):
    """Map a Student to the safe public dict (never includes the password)."""
    return {
        'id': student.id,
        'name': student.full_name,
        'full_name': student.full_name,
        'email': normalize_email(student.email) or student.email,
        'mobile': normalize_mobile(student.mobile) or student.mobile,
        'college': student.college,
        'course': student.course,
        'branch': student.branch,
        'year': student.year,
        'gender': student.gender,
        'budget': student.budget,
        'preferred_room_type': student.preferred_room_type,
        'preferredRoom': student.preferred_room_type,
        'mother_name': student.mother_name,
        'father_name': student.father_name,
        'parent_phone': student.parent_phone,
        'email_verified': student.email_verified,
        'mobile_verified': student.mobile_verified,
        'is_active': student.is_active,
        'role': student.role,
        'created_at': student.created_at.isoformat() if student.created_at else None,
    }


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    mobile = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    password = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.CharField(validators=[validate_email])


class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=120)
    mobile = serializers.CharField(validators=[validate_mobile])
    email = serializers.CharField(validators=[validate_email])
    password = serializers.CharField(validators=[validate_password])

    college = serializers.CharField(required=False, allow_blank=True, default='')
    course = serializers.CharField(required=False, allow_blank=True, default='')
    branch = serializers.CharField(required=False, allow_blank=True, default='')
    year = serializers.CharField(required=False, allow_blank=True, default='')
    gender = serializers.CharField(required=False, allow_blank=True, default='')
    budget = serializers.CharField(required=False, allow_blank=True, default='')
    preferred_room_type = serializers.CharField(required=False, allow_blank=True, default='')
    mother_name = serializers.CharField(required=False, allow_blank=True, default='')
    father_name = serializers.CharField(required=False, allow_blank=True, default='')
    parent_phone = serializers.CharField(required=False, allow_blank=True, default='')

    def validate_preferred_room_type(self, value):
        return value or ''

    def validate_full_name(self, value):
        name = (value or '').strip()
        if len(name) < 3:
            raise serializers.ValidationError('Enter your full name (min 3 characters).')
        return name

    def validate_mother_name(self, value):
        return (value or '').strip()

    def validate_father_name(self, value):
        return (value or '').strip()

    def validate_parent_phone(self, value):
        value = (value or '').strip()
        if value and not normalize_mobile(value):
            raise serializers.ValidationError('Enter a valid 10-digit parent phone number.')
        return value


class RefreshTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()