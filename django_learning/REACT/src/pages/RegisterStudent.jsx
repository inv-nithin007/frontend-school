import React, { useState, useEffect } from "react";
import {
  Container, Paper, Typography, TextField, Button, Grid, 
  Alert, MenuItem, CircularProgress, Box, Divider
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "../utils/axios";

const GRADE_CLASSES = [
  "Grade 1-A", "Grade 1-B", "Grade 2-A", "Grade 2-B",
  "Grade 3-A", "Grade 3-B", "Grade 4-A", "Grade 4-B",
  "Grade 5-A", "Grade 5-B", "Grade 6-A", "Grade 6-B"
];

export default function RegisterStudent({ onClose }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const { 
    control, 
    handleSubmit, 
    watch, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      firstName: "", lastName: "", email: "", rollNumber: "", classGrade: "",
      phoneNumber: "", assignedTeacher: "", password: "", confirmPassword: ""
    }
  });

  const watchPassword = watch("password");

  // Fetch teachers on component mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/teachers/');
        setTeachers(response.data.results || response.data);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load teachers" });
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  // Form submission
  const onSubmit = async (data) => {
    try {
      setMessage({ type: "", text: "" });
      
      const requestData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        roll_number: data.rollNumber,
        class_grade: data.classGrade,
        phone_number: data.phoneNumber || "",
        assigned_teacher: data.assignedTeacher || null,
        password: data.password,
        date_of_birth: "2000-01-01",
        admission_date: new Date().toISOString().split('T')[0],
        status: "active"
      };

      await axios.post('/api/students/', requestData);
      setMessage({ type: "success", text: "Student registered successfully!" });
      reset();
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Registration failed";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" color="primary">Register New Student</Typography>
          <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
            Close
          </Button>
        </Box>

        {/* Status Message */}
        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: "", text: "" })}>
            {message.text}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Personal Information */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Personal Information</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                rules={{
                  required: "First name is required",
                  minLength: { value: 2, message: "Must be at least 2 characters" },
                  maxLength: { value: 50, message: "Cannot exceed 50 characters" },
                  pattern: { value: /^[a-zA-Z\s]+$/, message: "Only letters and spaces allowed" }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name *"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                rules={{
                  required: "Last name is required",
                  minLength: { value: 2, message: "Must be at least 2 characters" },
                  maxLength: { value: 50, message: "Cannot exceed 50 characters" },
                  pattern: { value: /^[a-zA-Z\s]+$/, message: "Only letters and spaces allowed" }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name *"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address"
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="email"
                    label="Email Address *"
                    error={!!errors.email}
                    helperText={errors.email?.message || "This will be their username for login"}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="phoneNumber"
                control={control}
                rules={{
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Phone number must be exactly 10 digits"
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone Number"
                    placeholder="10-digit phone number"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Academic Information */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Academic Information</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="rollNumber"
                control={control}
                rules={{
                  required: "Roll number is required",
                  minLength: { value: 3, message: "Must be at least 3 characters" },
                  maxLength: { value: 20, message: "Cannot exceed 20 characters" }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Roll Number *"
                    placeholder="e.g., STU001"
                    error={!!errors.rollNumber}
                    helperText={errors.rollNumber?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="classGrade"
                control={control}
                rules={{
                  required: "Class selection is required"
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="Class *"
                    error={!!errors.classGrade}
                    helperText={errors.classGrade?.message}
                    disabled={isSubmitting}
                  >
                    {GRADE_CLASSES.map((className) => (
                      <MenuItem key={className} value={className}>
                        {className}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              {loading ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <CircularProgress size={20} />
                  <Typography>Loading teachers...</Typography>
                </Box>
              ) : (
                <Controller
                  name="assignedTeacher"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Assigned Teacher (Optional)"
                      helperText="Select a teacher to assign to this student"
                      disabled={isSubmitting}
                    >
                      <MenuItem value="">
                        <em>No teacher assigned</em>
                      </MenuItem>
                      {teachers.map((teacher) => (
                        <MenuItem key={teacher.id} value={teacher.id}>
                          {teacher.first_name} {teacher.last_name} - {teacher.subject}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Login Credentials */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Login Credentials</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="Password *"
                    error={!!errors.password}
                    helperText={errors.password?.message || "Minimum 6 characters"}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Password confirmation is required",
                  validate: (value) => value === watchPassword || "Passwords do not match"
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="Confirm Password *"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message || "Re-enter the password"}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              size="large"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ minWidth: 160 }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Registering...
                </>
              ) : (
                "Register Student"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}