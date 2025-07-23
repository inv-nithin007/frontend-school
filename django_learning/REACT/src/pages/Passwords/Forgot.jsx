import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const forgotPassword = async (data) => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/auth/forgot-password/', {
        email: data.email
      });
      
      setMessage(response.data.message);
      setIsSuccess(true);
      
    } catch (error) {
      setIsSuccess(false);
      if (error.response?.data?.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('Error sending reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxWidth="500px" margin="0 auto" padding={3}>
      <Typography variant="h4" align="center" gutterBottom>
        Forgot Password
      </Typography>
      
      <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
        Enter your email address and we'll send you a link to reset your password.
      </Typography>
      
      {message && (
        <Alert 
          
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}
      
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit(forgotPassword)}>
          <TextField
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Please enter a valid email address'
              }
            })}
            fullWidth
            type="email"
            label="Email Address"
            placeholder="Enter your email address"
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isLoading || isSuccess}
            sx={{ mb: 3 }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            fullWidth
            disabled={isLoading || isSuccess}
            sx={{ mb: 2 }}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
        
        <Box textAlign="center">
          <Button
            component="submit"
            variant="contained"
            onClick={() => navigate('/login')}
           
          >
            Back to Login
          </Button>
        </Box>
      </Paper>

      {isSuccess && (
        <Paper elevation={1} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" gutterBottom>
            What's next?
          </Typography>
          <Typography variant="body2" >
            1. Check your email inbox (and spam folder)<br/>
            2. Click the reset link in the email<br/>
            3. Enter your new password<br/>
            4. Login with your new password
          </Typography>
        </Paper>
      )}
    </Box>
  );
}