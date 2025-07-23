import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";


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
        
       
        <Typography variant="h4" sx={{ mb: 2 }}>
          Login
        </Typography>
        
        <Typography variant="h6" color="gray" sx={{ marginBottom: 4 }}>
          School Management System
        </Typography>

        
        <Paper sx={{ padding: 4, maxWidth: 400, margin: '0 auto' }}>
          
          
          {errorMessage && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {errorMessage}
            </Alert>
          )}

          
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

          <Button
              type="submit"
              fullWidth
              sx={{mt:2}}
              variant="contained"
              size="large"
              onClick={()=>navigate('/forgot')}
            >
              Forgot Password
            </Button>
        </Paper>
      </Box>
    </Container>
  );
}