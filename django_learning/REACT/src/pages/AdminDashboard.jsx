import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Chip
}
 from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  PersonAdd as PersonAddIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon
} from "@mui/icons-material";
import axios from "../utils/axios";
import RegisterStudent from "./RegisterStudent";
import RegisterTeacher from "./RegisterTeacher";

export default function AdminDashboard() {
  // State management
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    activeStudents: 0,
    activeTeachers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  
  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    initializeDashboard();
  }, [navigate]);

  // Initialization Functions
  const initializeDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      
      const { token, userData } = validateAuthentication();
      if (!token || !userData) return;
      
      setUserData(userData);
      await fetchDashboardStats(token);
      
    } catch (err) {
      console.error("Dashboard initialization error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const validateAuthentication = () => {
    const token = localStorage.getItem("access");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      navigate("/login");
      return {};
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        navigate("/login");
        return {};
      }
      return { token, userData: parsedUser };
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
      return {};
    }
  };

  const setUserData = (userData) => {
    setUser({
      name: userData.first_name || userData.username,
      email: userData.email,
      role: userData.role,
      fullName: `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
    });
  };

  // API Functions
  const fetchDashboardStats = async (token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch students and teachers data
      const [studentsResponse, teachersResponse] = await Promise.all([
        axios.get('/api/students/', { headers }),
        axios.get('/api/teachers/', { headers })
      ]);
      
    const studentsData = studentsResponse.data.results || studentsResponse.data;
    const teachersData = teachersResponse.data.results || teachersResponse.data;
    const students = studentsData;
    const teachers = teachersData;


    const activeStudents = students.filter(student => student.status === 'active').length;
    const activeTeachers = teachers.filter(teacher => teacher.status === 'active').length;

setStats({
  totalStudents: students.length,
  totalTeachers: teachers.length,
  activeStudents,
  activeTeachers
});
      
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load statistics");
      
      // Set default stats on error
      setStats({
        totalStudents: 0,
        totalTeachers: 0,
        activeStudents: 0,
        activeTeachers: 0
      });
    }
  };

  // Event Handlers
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleRegisterStudent = () => {
    if (!validateAdminAccess()) return;
    setShowStudentForm(true);
  };

  const handleRegisterTeacher = () => {
    if (!validateAdminAccess()) return;
    setShowTeacherForm(true);
  };

  const validateAdminAccess = () => {
    const token = localStorage.getItem("access");
    const userData = localStorage.getItem("user");
    
    if (!token) {
      setError("No access token found. Please login again.");
      return false;
    }
    
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        setError("Only admins can perform this action");
        return false;
      }
    }
    
    return true;
  };

  const handleCloseStudentForm = () => {
    setShowStudentForm(false);
    // Refresh stats after closing form (in case new student was added)
    const token = localStorage.getItem("access");
    if (token) fetchDashboardStats(token);
  };

  const handleCloseTeacherForm = () => {
    setShowTeacherForm(false);
    // Refresh stats after closing form (in case new teacher was added)
    const token = localStorage.getItem("access");
    if (token) fetchDashboardStats(token);
  };

  
  const handleViewAllStudents = () => navigate("/students");
  
  const handleViewAllTeachers = () => navigate("/teachers");
  // Render Functions
  const renderStatCard = (title, total, active, icon, color = "primary") => (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color={`${color}.main`} gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {total}
            </Typography>
            <Box mt={1}>
              <Chip 
                label={`${active} Active`} 
                size="small" 
                color={active === total ? "success" : "default"}
                variant="outlined"
              />
            </Box>
          </Box>
          <Box color={`${color}.main`}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderActionButton = (title, onClick, icon, variant = "contained") => (
    <Button
      fullWidth
      variant={variant}
      size="large"
      startIcon={icon}
      onClick={onClick}
      sx={{ py: 2, justifyContent: 'flex-start' }}
    >
      {title}
    </Button>
  );

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="xs">
        <Box mt={10} textAlign="center">
          <CircularProgress size={40} />
          <Typography variant="h6" mt={2}>Loading Dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  // Error state
  if (!user) {
    return (
      <Container maxWidth="xs">
        <Box mt={10} textAlign="center">
          <Typography variant="h5" color="error">
            Authentication Error
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate("/login")}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Show main dashboard only when no forms are open */}
      {!showStudentForm && !showTeacherForm && (
        <Box mt={4}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography variant="h3" gutterBottom>
                Admin Dashboard
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                School Management System
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleLogout}
              size="large"
            >
              Logout
            </Button>
          </Box>
          
          {/* Welcome Section */}
          <Box mb={4}>
            <Typography variant="h5" mb={1}>
              Welcome back, {user.fullName || user.name}!
            </Typography>
            <Typography color="textSecondary" mb={1}>
              {user.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage your school system from this central dashboard.
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {/* Statistics Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6}>
              {renderStatCard(
                "Total Students",
                stats.totalStudents,
                stats.activeStudents,
                <PeopleIcon sx={{ fontSize: 40 }} />,
                "primary"
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderStatCard(
                "Total Teachers",
                stats.totalTeachers,
                stats.activeTeachers,
                <SchoolIcon sx={{ fontSize: 40 }} />,
                "secondary"
              )}
            </Grid>
          </Grid>

          {/* Actions Section */}
          <Box>
            <Typography variant="h5" mb={3}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                {renderActionButton(
                  "Register Student",
                  handleRegisterStudent,
                  <PersonAddIcon />
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderActionButton(
                  "Register Teacher",
                  handleRegisterTeacher,
                  <PersonAddIcon />
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderActionButton(
                  "View All Students",
                  handleViewAllStudents,
                  <PeopleIcon />,
                  "outlined"
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderActionButton(
                  "View All Teachers",
                  handleViewAllTeachers,
                  <SchoolIcon />,
                  "outlined"
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}

      {/* Registration Forms */}
      {showStudentForm && (
        <RegisterStudent onClose={handleCloseStudentForm} />
      )}
      
      {showTeacherForm && (
        <RegisterTeacher onClose={handleCloseTeacherForm} />
      )}
    </Container>
  );
}