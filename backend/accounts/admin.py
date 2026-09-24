from django.contrib import admin

from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'email', 'mobile', 'role', 'is_active', 'email_verified', 'created_at')
    list_filter = ('is_active', 'email_verified', 'mobile_verified', 'role', 'course', 'gender')
    search_fields = ('full_name', 'email', 'mobile', 'role')
    readonly_fields = ('created_at', 'updated_at')