"""Create the reference accounts used by the React frontend.

Run with:  python manage.py seed_accounts

Creates (or updates, keeping existing passwords unless --reset-passwords is
passed):
  - Student demo   : student@demo.app / demo123        (role: student)
  - Owner          : owner@staynest.in  / owner123     (role: owner)
  - Admin          : admin@staynest.in  / admin123     (role: admin)

The emails/mobile used here match src/config.js (HOSTEL.ownerMobile) and the
auth pages so the existing UI works against the Django backend unchanged.
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from accounts.models import Student
from accounts.validators import normalize_email, normalize_mobile

OWNER_MOBILE = '6303693659'

SEED_ACCOUNTS = [
    {
        'role': Student.ROLE_STUDENT,
        'full_name': 'Demo Student',
        'mobile': normalize_mobile('9999999999') or '9999999999',
        'email': 'student@demo.app',
        'password': 'demo123',
        'is_active': True,
    },
    {
        'role': Student.ROLE_OWNER,
        'full_name': 'Hostel Owner',
        'mobile': OWNER_MOBILE,
        'email': 'owner@staynest.in',
        'password': 'owner123',
        'is_active': True,
    },
    {
        'role': Student.ROLE_ADMIN,
        'full_name': 'Hostel Admin',
        'mobile': normalize_mobile('8888888888') or '8888888888',
        'email': 'admin@staynest.in',
        'password': 'admin123',
        'is_active': True,
    },
]


class Command(BaseCommand):
    help = 'Create the demo student, owner and admin accounts used by the frontend.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset-passwords',
            action='store_true',
            help='Reset passwords/roles of existing accounts to the seed values.',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        reset = options.get('reset_passwords')
        created = 0
        updated = 0
        for seed in SEED_ACCOUNTS:
            email = normalize_email(seed['email'])
            student, was_created = Student.objects.get_or_create(
                email=email,
                defaults={**seed, 'email_verified': True, 'mobile_verified': True},
            )
            if was_created:
                student.set_password(seed['password'])
                created += 1
            elif reset:
                student.role = seed['role']
                student.full_name = seed['full_name']
                student.mobile = seed['mobile']
                student.is_active = True
                student.set_password(seed['password'])
                updated += 1
            student.email_verified = True
            student.mobile_verified = True
            student.save()

        self.stdout.write(self.style.SUCCESS(
            f'Seed accounts ready: {created} created, {updated} updated.'
        ))
        for seed in SEED_ACCOUNTS:
            self.stdout.write(f'  - {seed["role"]:<8} {seed["email"]:<28} {seed["password"]}')