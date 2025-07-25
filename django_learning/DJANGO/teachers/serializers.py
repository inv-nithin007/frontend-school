from rest_framework import serializers
from .models import Teacher
import re

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone_number',
            'subject', 'qualification', 'experience_years', 'salary', 'status'
        ]
        # Exclude 'user' field since the view creates it automatically
        read_only_fields = ['id']
        
    def validate_email(self, value):
        # Check email format
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value):
            raise serializers.ValidationError("Please enter a valid email address.")
        
        # Check if email already exists
        instance = self.instance
        if instance and instance.email == value:
            return value
        if Teacher.objects.filter(email=value).exists():
            raise serializers.ValidationError("Teacher with this email already exists.")
        return value
    
    def validate_phone_number(self, value):
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
    
    def validate_subject(self, value):
        # Check length
        if len(value) < 2:
            raise serializers.ValidationError("Subject must be at least 2 characters long.")
        if len(value) > 100:
            raise serializers.ValidationError("Subject cannot be more than 100 characters long.")
        return value
