from django.contrib.auth.hashers import make_password
from django.db import models


class Student(models.Model):
    """A staff/student account. Passwords are stored with Django's hasher.

    Roles: student (hostel resident), owner (hostel management), admin (hostel
    administration). Every account authenticates with email & password only —
    there is no OTP in this version.
    """

    ROLE_STUDENT = 'student'
    ROLE_OWNER = 'owner'
    ROLE_ADMIN = 'admin'
    ROLE_CHOICES = (
        (ROLE_STUDENT, 'Student'),
        (ROLE_OWNER, 'Owner'),
        (ROLE_ADMIN, 'Admin'),
    )

    id = models.BigAutoField(primary_key=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=ROLE_STUDENT, db_index=True)
    full_name = models.CharField(max_length=120)
    mobile = models.CharField(max_length=15, unique=True, db_index=True)
    email = models.EmailField(max_length=254, unique=True, db_index=True)
    password = models.CharField(max_length=255)
    college = models.CharField(max_length=150, blank=True, default='')
    course = models.CharField(max_length=120, blank=True, default='')
    branch = models.CharField(max_length=120, blank=True, default='')
    year = models.CharField(max_length=20, blank=True, default='')
    gender = models.CharField(max_length=20, blank=True, default='')
    budget = models.CharField(max_length=60, blank=True, default='')
    preferred_room_type = models.CharField(max_length=40, blank=True, default='')
    mother_name = models.CharField(max_length=120, blank=True, default='')
    father_name = models.CharField(max_length=120, blank=True, default='')
    parent_phone = models.CharField(max_length=20, blank=True, default='')
    email_verified = models.BooleanField(default=False)
    mobile_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password

        return check_password(raw_password, self.password)

    def __str__(self):
        return f'{self.full_name} <{self.email}>'