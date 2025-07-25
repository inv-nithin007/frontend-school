# React Frontend Fix Guide

## ✅ **ISSUES FIXED**

### 1. Environment Variable Fix
**Problem**: `Uncaught ReferenceError: process is not defined`
**Solution**: Updated to use Vite's environment variable syntax

**Changed**:
```javascript
// OLD (doesn't work with Vite)
const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

// NEW (works with Vite)
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
```

### 2. CORS Configuration
**Problem**: Frontend couldn't connect to Django backend
**Solution**: Added CORS headers to Django settings

**Added to Django**:
- Installed `django-cors-headers`
- Added to INSTALLED_APPS and MIDDLEWARE
- Configured for localhost:5173 (Vite default port)

## 🚀 **How to Test the Fix**

### Step 1: Start Django Backend
```bash
cd /home/nithinkrishna/django_learning/DJANGO
source venv/bin/activate
python manage.py runserver 8000
```

### Step 2: Start React Frontend
```bash
cd /home/nithinkrishna/django_learning/REACT
npm run dev
```

### Step 3: Test Connection
1. Go to `http://localhost:5173/test`
2. Click "Test Connection" button
3. Should see: "✅ Connection working (login failed as expected)"

### Step 4: Test Login
1. Go to `http://localhost:5173/login`
2. Try logging in with:
   - Username: `admin` Password: `admin123`
   - Username: `student` Password: `student123`
   - Username: `teacher` Password: `teacher123`

## 🎯 **Expected Results**

### Working Login Flow
1. **Login Page**: No more white screen or console errors
2. **Authentication**: Login with test credentials works
3. **Dashboard Routing**: Redirects to correct dashboard based on role
4. **API Calls**: Frontend can communicate with Django backend

### Test Credentials
| Username | Password | Role | Expected Dashboard |
|----------|----------|------|-------------------|
| admin | admin123 | Admin | Admin Dashboard |
| student | student123 | Student | Student Dashboard |
| teacher | teacher123 | Teacher | Teacher Dashboard |

## 🔧 **Files Modified**

### React Frontend
- `src/pages/Login.jsx` - Fixed environment variable
- `src/pages/Dashboard.jsx` - Fixed environment variable
- `src/App.jsx` - Added test route
- `src/pages/TestPage.jsx` - New connection test page

### Django Backend
- `school_management/settings.py` - Added CORS configuration
- Installed `django-cors-headers` package

## 📝 **Environment Variables (Optional)**

You can create a `.env` file in the React root directory:
```
VITE_API_URL=http://localhost:8000
```

If no `.env` file exists, it defaults to `http://localhost:8000`.

## ✅ **Verification Checklist**

- [ ] Django server starts without errors
- [ ] React dev server starts without errors  
- [ ] No console errors in browser
- [ ] Login page loads properly
- [ ] Connection test works
- [ ] Login with test credentials works
- [ ] Dashboard routing works based on role
- [ ] Logout functionality works

## 🎉 **Result**

Your React frontend should now work perfectly with the Django backend! The white screen issue is resolved and you can test the complete login flow.