from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from accounts.models import UserProfile
from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
    
    def check_admin_permission(self, request):
        """Check if the user is an admin"""
        if hasattr(request.user, 'userprofile'):
            user_role = request.user.userprofile.role
            if user_role == 'admin':
                return True
        return False
    
    def create(self, request, *args, **kwargs):
        # Check if user is admin
        if not self.check_admin_permission(request):
            return Response(
                {'error': 'Only admins can create students'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            # Get password from request
            password = request.data.get('password')
            if not password:
                return Response(
                    {'error': 'Password is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate password length
            if len(password) < 6:
                return Response(
                    {'error': 'Password must be at least 6 characters long'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Create user with admin-provided password
            user = User.objects.create_user(
                username=serializer.validated_data['email'],
                email=serializer.validated_data['email'],
                first_name=serializer.validated_data['first_name'],
                last_name=serializer.validated_data['last_name'],
                password=password  # Use admin-provided password
            )
            
            UserProfile.objects.create(user=user, role='student')
            student = Student.objects.create(user=user, **serializer.validated_data)
            
            response_data = StudentSerializer(student).data
            response_data['message'] = 'Student created successfully.'
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            
            user_data = {}
            for field in ['first_name', 'last_name', 'email']:
                if field in serializer.validated_data:
                    user_data[field] = serializer.validated_data[field]
            
            if 'email' in user_data:
                user_data['username'] = user_data['email']
            
            if user_data:
                User.objects.filter(id=instance.user.id).update(**user_data)
            
            serializer.save()
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def import_csv(self, request):
        """Import students from CSV file"""
        if not self.check_admin_permission(request):
            return Response(
                {'error': 'Only admins can import students'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        if 'file' not in request.FILES:
            return Response(
                {'error': 'No file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        csv_file = request.FILES['file']
        
        if not csv_file.name.endswith('.csv'):
            return Response(
                {'error': 'File must be a CSV'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            import csv
            import io
            
            # Read CSV file
            file_content = csv_file.read().decode('utf-8')
            csv_reader = csv.DictReader(io.StringIO(file_content))
            
            # Check required columns (including password)
            required_columns = [
                'first_name', 'last_name', 'email', 'phone_number', 
                'roll_number', 'class_grade', 'date_of_birth', 'admission_date', 'password'
            ]
            
            fieldnames = csv_reader.fieldnames
            missing_columns = [col for col in required_columns if col not in fieldnames]
            if missing_columns:
                return Response(
                    {'error': f'Missing required columns: {", ".join(missing_columns)}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            success_count = 0
            errors = []
            
            for index, row in enumerate(csv_reader):
                try:
                    # Validate password
                    if not row['password'] or len(row['password']) < 6:
                        errors.append(f"Row {index + 1}: Password must be at least 6 characters long")
                        continue
                    
                    # Check if user already exists
                    if User.objects.filter(email=row['email']).exists():
                        errors.append(f"Row {index + 1}: Email {row['email']} already exists")
                        continue
                    
                    if Student.objects.filter(roll_number=row['roll_number']).exists():
                        errors.append(f"Row {index + 1}: Roll number {row['roll_number']} already exists")
                        continue
                    
                    # Create user
                    user = User.objects.create_user(
                        username=row['email'],
                        email=row['email'],
                        first_name=row['first_name'],
                        last_name=row['last_name'],
                        password=row['password']  # Use password from CSV
                    )
                    
                    # Create user profile
                    UserProfile.objects.create(user=user, role='student')
                    
                    # Create student
                    Student.objects.create(
                        user=user,
                        first_name=row['first_name'],
                        last_name=row['last_name'],
                        email=row['email'],
                        phone_number=row['phone_number'],
                        roll_number=row['roll_number'],
                        class_grade=row['class_grade'],
                        date_of_birth=row['date_of_birth'],
                        admission_date=row['admission_date'],
                        status='active'
                    )
                    
                    success_count += 1
                    
                except Exception as e:
                    errors.append(f"Row {index + 1}: {str(e)}")
            
            return Response({
                'message': f'Successfully imported {success_count} students',
                'success_count': success_count,
                'errors': errors
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
