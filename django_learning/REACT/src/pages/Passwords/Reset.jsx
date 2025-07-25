import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Paper,
  Link
} from '@mui/material';
import axios from '../../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function ResetPassword() {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams(); 

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (!token) {
      setMessage('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const resetPassword = async (data) => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/auth/reset-password/', {
        token: token,
        new_password: data.new_password
      });
      
      setMessage(response.data.message);
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      setIsSuccess(false);
      if (error.response?.data?.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('Error resetting password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxWidth="500px" margin="0 auto" padding={3}>
      <Typography variant="h4" align="center" gutterBottom>
        Reset Password
      </Typography>
      
      <Typography variant="h5" align="center" color="textSecondary" sx={{ mb: 3 }}>
        Enter your new password below.
      </Typography>
      
      {message && (
        <Alert 
          
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}
      
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit(resetPassword)}>
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
            disabled={isLoading || isSuccess || !token}
            sx={{ mb: 2 }}
          />

          <TextField
            {...register('confirm_password', { 
              required: 'Please confirm your password'
            })}
            fullWidth
            type="password"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            error={!!errors.confirm_password}
            helperText={errors.confirm_password?.message}
            disabled={isLoading || isSuccess || !token}
            sx={{ mb: 3 }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            fullWidth
            disabled={isLoading || isSuccess || !token}
            sx={{ mb: 2 }}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
        
        <Box textAlign="center">
          <Link 
            component="button"
            variant="body2"
            onClick={() => navigate('/login')}
            sx={{ textDecoration: 'none' }}
          >
            Back to Login
          </Link>
        </Box>
      </Paper>

      {isSuccess && (
        <Paper elevation={1} sx={{ p: 3, backgroundColor: '#e8f5e8' }}>
          <Typography variant="h6" gutterBottom color="success.main">
            Password Reset Successfully!
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Your password has been updated. You will be redirected to the login page in a few seconds.
          </Typography>
        </Paper>
      )}

      {!token && (
        <Paper elevation={1} sx={{ p: 3, backgroundColor: '#ffebee' }}>
          <Typography variant="h6" gutterBottom color="error.main">
            Invalid Reset Link
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            This reset link is invalid or has expired. Please request a new password reset.
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/forgot')}
            
          >
            Request New Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}