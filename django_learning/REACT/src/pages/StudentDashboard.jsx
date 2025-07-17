import { Container, Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios"; // Ready for future API calls

export default function StudentDashboard() {
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
      role: "student",
      email: parsedUser.email
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleViewTeachers = async () => {
    try {
      // Example of how to make API calls with interceptor
      const response = await axios.get('/api/teachers/');
      console.log("Teachers:", response.data);
      // Handle the response - maybe show in a modal or navigate to teachers page
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleViewExams = async () => {
    try {
      // Example API call for exams
      const response = await axios.get('/api/exams/');
      console.log("Exams:", response.data);
      // Handle the response
    } catch (error) {
      console.error("Error fetching exams:", error);
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
          <Typography variant="h3">Student Dashboard</Typography>
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
                onClick={handleViewTeachers}
              >
                View Assigned Teachers
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ py: 2 }}
                onClick={handleViewExams}
              >
                Exams
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
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}