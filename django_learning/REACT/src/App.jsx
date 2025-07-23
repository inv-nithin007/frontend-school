import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TestPage from "./pages/TestPage";
import StudentsList from "./pages/StudentsList";
import TeachersList from "./pages/TeachersList";
import TeacherStudentsView from "./pages/TeacherStudentsView";
import ExamsList from "./pages/Exams/ExamsList";
import CreateExam from "./pages/Exams/CreateExam";
import StudentTeacherView from "./pages/StudentTeacherView";
import StudentProfileView from "./pages/StudentProfileView";
import Reset from "./pages/Passwords/Reset";
import Change from "./pages/Passwords/Change";
import Forgot from "./pages/Passwords/Forgot";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create-exam" element={<CreateExam />} />
        <Route path="/change" element={<Change />} />
        <Route path="/reset/:token" element={<Reset />} />
        <Route path="/forgot" element={<Forgot />} />
      
      	<Route path="/student-profile" element={<StudentProfileView />} />   
     	<Route path="/student-teacher" element={<StudentTeacherView />} />   
  	<Route path="/exam-list" element={<ExamsList />} />
	<Route path="/teacher-students" element={<TeacherStudentsView />} />
	<Route path="/students" element={<StudentsList />} />
  	<Route path="/teachers" element={<TeachersList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/test" element={<TestPage />} />
        {/* fallback: anything else → login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
