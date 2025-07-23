import { Container, Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios"; 

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser({
      name: parsedUser.first_name || parsedUser.username,
      role: "teacher",
      email: parsedUser.email
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleViewStudents = async () => {
    try {
      
      const response = await axios.get('/api/students/');
      console.log("Students:", response.data);

    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };



  if (!user) {
    return (
      <Container maxWidth="xs">
        <Box mt={10} textAlign="center">
          <Typography variant="h5">Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h3">Teacher Dashboard</Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        
        <Box mb={4}>
          <Typography variant="h5" mb={2}>Welcome back, {user.name}!</Typography>
          <Typography color="textSecondary" mb={1}>
            Email: {user.email}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" mb={3}>Actions</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ py: 2 }}
                onClick={() => navigate('/teacher-students')}
              >
                View All Students
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ py: 2 }}
                onClick={()=>navigate('/create-exam')}
              >
                Create Exam
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{ py: 2 }}
              >
                Show Profile
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{ py: 2 }}
              >
                Update Profile
              </Button>

              <Button
                fullWidth
                variant="contained"
                onClick={()=>navigate('/change')}
                size="large"
                sx={{ mt: 3 }}
              >
                Change Password
              </Button>
              
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
