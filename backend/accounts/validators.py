import re

from rest_framework import serializers

INDIAN_MOBILE_RE = re.compile(r'^(\+?91[\s-]?)?[6-9][0-9]{9}$')
EMAIL_RE = re.compile(r'^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$')


def normalize_mobile(value):
    """Return a 10-digit Indian mobile string with +91 country code, or None."""
    if not value:
        return None
    raw = re.sub(r'[^0-9]', '', str(value))
    if raw.startswith('91') and len(raw) == 12:
        raw = raw[2:]
    if not INDIAN_MOBILE_RE.match(raw):
        return None
    return raw


def normalize_email(value):
    if not value:
        return None
    email = str(value).strip().lower()
    if not EMAIL_RE.match(email) or len(email) > 254:
        return None
    return email


def validate_mobile(value):
    mobile = normalize_mobile(value)
    if not mobile:
        raise serializers.ValidationError('Enter a valid Indian mobile number (10 digits, starting with 6-9).')
    return mobile


def validate_email(value):
    email = normalize_email(value)
    if not email:
        raise serializers.ValidationError('Enter a valid email address.')
    return email


PASSWORD_RE = re.compile(r'^(?=.*[A-Za-z])(?=.*[0-9]).{8,}$')


def validate_password(value):
    if not isinstance(value, str) or not PASSWORD_RE.match(value):
        raise serializers.ValidationError(
            'Password must be at least 8 characters long and contain both letters and numbers.'
        )
    return value