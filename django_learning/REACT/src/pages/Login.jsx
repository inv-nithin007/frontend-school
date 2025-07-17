import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

// Material UI imports
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from "@mui/material";

export default function Login() {
  
  const [errorMessage, setErrorMessage] = useState("");
  
  
  const navigate = useNavigate();
  
  // 3. Form hook
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  
  const onLogin = async (formData) => {
    
    setErrorMessage("");
    
    try {
      
      const response = await axios.post("http://localhost:8000/api/auth/login/", {
        username: formData.username,
        password: formData.password
      });
      
      
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      
      navigate("/dashboard");
      
    } catch (error) {
      setErrorMessage("Wrong username or password!");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, textAlign: 'center' }}>
        
        {/* Title */}
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Login
        </Typography>
        
        <Typography variant="h6" color="gray" sx={{ marginBottom: 4 }}>
          School Management System
        </Typography>

        {/* Login Box */}
        <Paper sx={{ padding: 4, maxWidth: 400, margin: '0 auto' }}>
          
          {/* Error Message */}
          {errorMessage && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onLogin)}>
            
            {/* Username Input */}
            <TextField
              fullWidth
              label="Username"
              sx={{ marginBottom: 3}}
              {...register("username", { required: "Please enter username" })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            {/* Password Input */}
            <TextField
              fullWidth
              label="Password"
              type="password"
              sx={{ marginBottom: 3 }}
              {...register("password", { required: "Please enter password" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
            
          </form>
        </Paper>
      </Box>
    </Container>
  );
}