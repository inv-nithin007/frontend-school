from rest_framework import serializers
from .models import Student
import re

class StudentSerializer(serializers.ModelSerializer):
    assigned_teacher_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone_number',
            'roll_number', 'class_grade', 'date_of_birth', 'admission_date',
            'status', 'assigned_teacher', 'assigned_teacher_name'
        ]
        # Exclude 'user' field since the view creates it automatically
        read_only_fields = ['id', 'assigned_teacher_name']
    
    def get_assigned_teacher_name(self, obj):
        if obj.assigned_teacher:
            return f"{obj.assigned_teacher.first_name} {obj.assigned_teacher.last_name}"
        return None
        
    def validate_email(self, value):
        # Check email format
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value):
            raise serializers.ValidationError("Please enter a valid email address.")
        
        # Check if email already exists
        instance = self.instance
        if instance and instance.email == value:
            return value
        if Student.objects.filter(email=value).exists():
            raise serializers.ValidationError("Student with this email already exists.")
        return value
    
    def validate_phone_number(self, value):
        # Allow empty phone number
        if not value:
            return value
            
        # Check phone number format (10 digits)
        phone_pattern = r'^\d{10}$'
        if not re.match(phone_pattern, value):
            raise serializers.ValidationError("Phone number must be exactly 10 digits.")
        return value
    
    def validate_first_name(self, value):
        # Check length and characters
        if len(value) < 2:
            raise serializers.ValidationError("First name must be at least 2 characters long.")
        if len(value) > 50:
            raise serializers.ValidationError("First name cannot be more than 50 characters long.")
        if not value.replace(' ', '').isalpha():
            raise serializers.ValidationError("First name can only contain letters and spaces.")
        return value
    
    def validate_last_name(self, value):
        # Check length and characters
        if len(value) < 2:
            raise serializers.ValidationError("Last name must be at least 2 characters long.")
        if len(value) > 50:
            raise serializers.ValidationError("Last name cannot be more than 50 characters long.")
        if not value.replace(' ', '').isalpha():
            raise serializers.ValidationError("Last name can only contain letters and spaces.")
        return value
    
    def validate_class_grade(self, value):
        # Check length
        if len(value) < 1:
            raise serializers.ValidationError("Class grade is required.")
        if len(value) > 10:
            raise serializers.ValidationError("Class grade cannot be more than 10 characters long.")
        return value
    
    def validate_roll_number(self, value):
        # Check length
        if len(value) < 3:
            raise serializers.ValidationError("Roll number must be at least 3 characters long.")
        if len(value) > 20:
            raise serializers.ValidationError("Roll number cannot be more than 20 characters long.")
        
        # Check if roll number already exists
        instance = self.instance
        if instance and instance.roll_number == value:
            return value
        if Student.objects.filter(roll_number=value).exists():
            raise serializers.ValidationError("Student with this roll number already exists.")
        return value