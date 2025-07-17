import { Container, Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = () => {
      const token = localStorage.getItem("access");
      const userData = localStorage.getItem("user");
      
      if (!token || !userData) {
        navigate("/login");
        return;
      }

      try {
        const user = JSON.parse(userData);
        const userRole = user.role;
        
        // Redirect based on role
        if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else if (userRole === "teacher") {
          navigate("/teacher-dashboard");
        } else if (userRole === "student") {
          navigate("/student-dashboard");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.log("Error parsing user data:", error);
        navigate("/login");
      }
      
      setLoading(false);
    };

    checkUserRole();
  }, [navigate]);

  if (loading) {
    return (
      <Container maxWidth="xs">
        <Box mt={10} textAlign="center">
          <Typography variant="h5">Loading Dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  return null;
}
