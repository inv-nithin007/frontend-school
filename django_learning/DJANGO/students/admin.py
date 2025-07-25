from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'roll_number', 'class_grade', 'status']
    list_filter = ['status', 'class_grade']
    search_fields = ['first_name', 'last_name', 'roll_number', 'email']
    readonly_fields = ['user']