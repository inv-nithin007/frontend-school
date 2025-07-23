import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Paper
} from '@mui/material';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const changePassword = async (data) => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/auth/change-password/', {
        current_password: data.current_password,
        new_password: data.new_password
      });
      
      setMessage(response.data.message);
      setIsSuccess(true);
      reset(); // Clear form
      
    } catch (error) {
      setIsSuccess(false);
      if (error.response?.data?.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('Error changing password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxWidth="500px" margin="0 auto" padding={3}>
      <Typography variant="h4" align="center" gutterBottom>
        Change Password
      </Typography>
      
      <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
        Update your account password for better security.
      </Typography>
      
      {message && (
        <Alert 
          severity={isSuccess ? 'success' : 'error'}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}
      
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit(changePassword)}>
          <TextField
            {...register('current_password', { 
              required: 'Current password is required'
            })}
            fullWidth
            type="password"
            label="Current Password"
            placeholder="Enter your current password"
            error={!!errors.current_password}
            helperText={errors.current_password?.message}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />

          <TextField
            {...register('new_password', { 
              required: 'New password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long'
              }
            })}
            fullWidth
            type="password"
            label="New Password"
            placeholder="Enter your new password"
            error={!!errors.new_password}
            helperText={errors.new_password?.message}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />

          <TextField
            {...register('confirm_password', { 
              required: 'Please confirm your new password'
            })}
            fullWidth
            type="password"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            error={!!errors.confirm_password}
            helperText={errors.confirm_password?.message}
            disabled={isLoading}
            sx={{ mb: 3 }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            fullWidth
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            {isLoading ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
        
        <Box textAlign="center">
          <Button 
            variant="outlined"
            onClick={() => navigate(-1)}
            size="small"
          >
            Cancel
          </Button>
        </Box>
      </Paper>

      {isSuccess && (
        <Paper elevation={1} sx={{ p: 3, backgroundColor: '#e8f5e8' }}>
          <Typography variant="h6" gutterBottom color="success.main">
            Password Changed Successfully!
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Your password has been updated. Please login again with your new password if you're logged out.
          </Typography>
        </Paper>
      )}

      <Paper elevation={1} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          Password Security Tips
        </Typography>
        <Typography variant="body2" color="textSecondary" component="div">
          • Use at least 6 characters<br/>
          • Include a mix of letters, numbers, and symbols<br/>
          • Don't use personal information<br/>
          • Don't reuse passwords from other accounts<br/>
          • Update your password regularly
        </Typography>
      </Paper>
    </Box>
  );
}