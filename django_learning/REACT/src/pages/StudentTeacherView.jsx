import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Alert, 
  Paper
} from '@mui/material';

export default function StudentTeacherView() {
  const navigate = useNavigate();
  
  const userData = JSON.parse(localStorage.getItem('user'));
  
  const handleBack = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.role === 'admin') {
      navigate('/admin-dashboard'); 
    } else if (user.role === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Your Assigned Teacher
        </Typography>
      </Box>
      
      {userData.assigned_teacher_name ? (
        <Paper elevation={10} sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
          <Typography  variant="h5"  sx={{ mb: 1 }} color="gray">
            {userData.assigned_teacher_name}
             
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 1 }}>
            <Typography component="span" fontWeight="bold">Email:</Typography> {userData.assigned_teacher_email}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 1 }}>
            <Typography component="span" fontWeight="bold">Phone:</Typography> {userData.assigned_teacher_phone}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 1 }}>
            <Typography component="span" fontWeight="bold">Subject:</Typography> {userData.assigned_teacher_subject}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 1 }}>
            <Typography component="span" fontWeight="bold">Qualification:</Typography> {userData.assigned_teacher_qualification}
          </Typography>
          
          <Typography variant="body1">
            <Typography component="span" fontWeight="bold">Experience:</Typography> {userData.assigned_teacher_experience} years
          </Typography>
        </Paper>
      ) : (
        <Alert >
          <Typography variant="h2" gutterBottom>
            No Teacher Assigned
          </Typography>
          <Typography variant="h6">
            You don't have any teacher assigned yet. Please contact the admin.
          </Typography>
        </Alert>
      )}

      <Box textAlign="center">
        <Button 
          onClick={handleBack} 
          variant="contained" 
          size="large"
          sx={{ minWidth: 200 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
}