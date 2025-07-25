# School Management System

A simple Django REST API for managing students, teachers, and exams.

## Features

- JWT Authentication
- Student Management (CRUD)
- Teacher Management (CRUD)
- Exam Management (CRUD)
- Student-Teacher Assignment
- Exam Taking and Instant Results
- Simple and Clean Code Structure

## User Roles

- **Admin**: Can create/manage teachers, students, and exams
- **Teacher**: Can create/manage exams and view students
- **Student**: Can take exams and view results

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/token/` - Get JWT token
- `POST /api/token/refresh/` - Refresh JWT token

### Teachers
- `GET /api/teachers/` - List all teachers
- `POST /api/teachers/` - Create new teacher
- `GET /api/teachers/{id}/` - Get teacher details
- `PUT /api/teachers/{id}/` - Update teacher
- `DELETE /api/teachers/{id}/` - Delete teacher
- `GET /api/teachers/{id}/students/` - Get students under teacher

### Students
- `GET /api/students/` - List all students
- `POST /api/students/` - Create new student
- `GET /api/students/{id}/` - Get student details
- `PUT /api/students/{id}/` - Update student
- `DELETE /api/students/{id}/` - Delete student

### Exams
- `GET /api/exams/` - List all exams
- `POST /api/exams/` - Create new exam (teacher/admin only)
- `GET /api/exams/{id}/` - Get exam details
- `PUT /api/exams/{id}/` - Update exam (teacher/admin only)
- `DELETE /api/exams/{id}/` - Delete exam (teacher/admin only)
- `POST /api/exams/{id}/start_exam/` - Start exam (student only)
- `POST /api/exams/{id}/submit_exam/` - Submit exam answers (student only)

### Questions
- `GET /api/questions/` - List all questions
- `POST /api/questions/` - Create new question (teacher/admin only)
- `GET /api/questions/{id}/` - Get question details
- `PUT /api/questions/{id}/` - Update question (teacher/admin only)
- `DELETE /api/questions/{id}/` - Delete question (teacher/admin only)

### Student Exams
- `GET /api/student-exams/` - List student's exam attempts
- `GET /api/student-exams/{id}/` - Get exam attempt details
- `GET /api/student-exams/{id}/result/` - Get detailed exam result

## How to Run This Code

### Prerequisites
- Python 3.8 or higher
- Git (optional, for cloning)

### Step 1: Clone or Download the Project
```bash
# Option A: Clone with Git
git clone <repository-url>
cd school_manager

# Option B: Download ZIP and extract
# Then navigate to the project folder
cd school_manager
```

### Step 2: Create Virtual Environment (IMPORTANT)
```bash
# First, make sure you have python3-venv installed
sudo apt update
sudo apt install python3-venv python3-full

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# You should see (venv) at the beginning of your terminal prompt
```

### Step 3: Install Dependencies
```bash
# Make sure virtual environment is activated (you should see (venv) in terminal)
pip install -r requirements.txt

# If you still get errors, try:
pip3 install -r requirements.txt
```

### Step 4: Run Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 5: Start the Server
```bash
python manage.py runserver
```

### Step 6: Access the API
- Server runs on: `http://localhost:8000`
- API endpoints start with: `http://localhost:8000/api/`

### Step 7: Test the API
You can test using:
- **Postman**: Import the API endpoints
- **curl**: Command line testing
- **Browser**: For GET requests only

### Example API Calls

#### Register a New User
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teacher1",
    "password": "password123",
    "email": "teacher1@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "teacher"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teacher1",
    "password": "password123"
  }'
```

#### Create a Teacher (after login)
```bash
curl -X POST http://localhost:8000/api/teachers/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "phone_number": "1234567890",
    "subject_specialization": "Mathematics",
    "employee_id": "EMP001",
    "date_of_joining": "2024-01-15",
    "status": "active"
  }'
```

## Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Kill existing server
pkill -f "python manage.py runserver"
# Or use different port
python manage.py runserver 8001
```

**2. Module Not Found Error**
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Reinstall requirements
pip install -r requirements.txt
```

**3. Database Issues**
```bash
# Reset database
rm db.sqlite3
python manage.py migrate
```

**4. Permission Errors**
- Make sure you're logged in and have proper role (admin/teacher for creating exams)
- Check your JWT token is valid

## Default Password
All users created through the API get the default password: `defaultpassword123`

## Exam Submission Format
```json
{
  "answers": [
    {
      "question_id": "1",
      "selected_answer": "A"
    },
    {
      "question_id": "2", 
      "selected_answer": "B"
    }
  ]
}
```