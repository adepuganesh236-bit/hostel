"""
Real email delivery via Django's SMTP backend.

Configuration comes from .env (EMAIL_*). See backend/.env.example.
"""

import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger('accounts.email')

HOSTEL_NAME = 'Sai Krishna Hostel'


class EmailDeliveryError(Exception):
    pass


def send_password_reset_email(email, full_name, reset_url):
    if not settings.EMAIL_HOST_USER:
        raise EmailDeliveryError(
            'EMAIL_HOST_USER / EMAIL_HOST_PASSWORD are not configured in .env. '
            'Password reset emails cannot be sent.'
        )

    subject = f'Reset your {HOSTEL_NAME} password'
    message = (
        f'Hello {full_name or "student"},\n\n'
        f'We received a request to reset the password for your {HOSTEL_NAME} account.\n\n'
        f'Reset your password by opening the link below (valid for 24 hours):\n\n'
        f'{reset_url}\n\n'
        f'If you did not request this, you can safely ignore this email - no changes were made.\n\n'
        f'{HOSTEL_NAME}'
    )
    html_message = (
        '<p>Hello <strong>%s</strong>,</p>'
        '<p>We received a request to reset the password for your <strong>%s</strong> account.</p>'
        '<p>Reset your password by clicking the button below '
        '(the link is valid for <strong>24 hours</strong>):</p>'
        '<p style="margin:20px 0;">'
        '<a href="%s" style="background:#6340e6;color:#ffffff;padding:12px 22px;'
        'border-radius:10px;text-decoration:none;font-weight:600;">Reset my password</a></p>'
        '<p style="color:#64748b;font-size:13px;">If you did not request this, you can safely ignore '
        'this email - no changes were made.</p>'
        '<p>%s</p>'
    ) % (full_name or 'student', HOSTEL_NAME, reset_url, HOSTEL_NAME)

    sent = send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL or settings.EMAIL_HOST_USER,
        recipient_list=[email],
        html_message=html_message,
        fail_silently=False,
    )
    if not sent:
        raise EmailDeliveryError('The password reset email could not be sent. Please try again.')
    return True


def email_configured():
    return bool(settings.EMAIL_HOST_USER and settings.EMAIL_HOST_PASSWORD)