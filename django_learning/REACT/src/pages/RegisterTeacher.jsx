import React, { useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Grid, 
  Alert, MenuItem, CircularProgress, Box, Divider
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "../utils/axios";

const SUBJECTS = [
  "Mathematics", "Science", "English", "History", "Geography",
  "Physics", "Chemistry", "Biology", "Computer Science", "Art",
  "Physical Education", "Music", "Economics", "Psychology", "Sociology"
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" }
];

export default function RegisterTeacher({ onClose }) {
  const [message, setMessage] = useState({ type: "", text: "" });

  const { 
    control, 
    handleSubmit, 
    watch, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      firstName: "", lastName: "", email: "", phoneNumber: "", subject: "",
      qualification: "", experienceYears: 0, salary: "", status: "active",
      password: "", confirmPassword: ""
    }
  });

  const watchPassword = watch("password");

  // Form submission
  const onSubmit = async (data) => {
    try {
      setMessage({ type: "", text: "" });
      
      const requestData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber || "",
        subject: data.subject,
        qualification: data.qualification || "",
        experience_years: parseInt(data.experienceYears) || 0,
        salary: data.salary ? parseFloat(data.salary) : null,
        status: data.status,
        password: data.password
      };

      await axios.post('/api/teachers/', requestData);
      setMessage({ type: "success", text: "Teacher registered successfully!" });
      reset();
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Registration failed";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={24} sx={{ p: 3, mt: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" color="primary">Register New Teacher</Typography>
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

          {/* Professional Information */}
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Professional Information</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={7} sm={6}>
              <Controller
                name="subject"
                control={control}
                rules={{
                  required: "Subject specialization is required",
                  minLength: { value: 2, message: "Must be at least 2 characters" }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="Subject Specialization *"
                    error={!!errors.subject}
                    helperText={errors.subject?.message}
                    disabled={isSubmitting}
                  >
                    {SUBJECTS.map((subject) => (
                      <MenuItem key={subject} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="qualification"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Qualification"
                    placeholder="e.g., M.Sc. Mathematics, B.Ed."
                    error={!!errors.qualification}
                    helperText={errors.qualification?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="experienceYears"
                control={control}
                rules={{
                  min: { value: 0, message: "Experience cannot be negative" },
                  max: { value: 50, message: "Experience cannot exceed 50 years" }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Experience (Years)"
                    inputProps={{ min: 0, max: 50 }}
                    error={!!errors.experienceYears}
                    helperText={errors.experienceYears?.message || "Enter 0 for fresh candidates"}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="salary"
                control={control}
                rules={{
                  min: { value: 0, message: "Salary cannot be negative" }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Salary (Optional)"
                    inputProps={{ min: 0, step: 0.01 }}
                    placeholder="Monthly salary amount"
                    error={!!errors.salary}
                    helperText={errors.salary?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                rules={{
                  required: "Employment status is required"
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="Employment Status"
                    error={!!errors.status}
                    helperText={errors.status?.message}
                    disabled={isSubmitting}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
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
                "Register Teacher"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}