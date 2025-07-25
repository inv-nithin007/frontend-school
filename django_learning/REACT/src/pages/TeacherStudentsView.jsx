import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  
} from '@mui/material';

export default function StudentsList() {
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/students/');
      const studentsData = response.data.results;
      setAllStudents(studentsData);
    } catch (error) {
      console.log('Error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const startIndex = (page - 1) * 3;
  const endIndex = startIndex + 3;
  const currentStudents = allStudents.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allStudents.length / 3);

  const handleBack = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2,maxWidth: '50%', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Students
      </Typography>
      <Paper elevation={10}>
      <TableContainer >
        <Table border={3}>
          <TableHead >
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Roll Number</strong></TableCell>
              <TableCell><strong>Class</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentStudents.map((student, index) => (
              <TableRow >
                <TableCell>{student.first_name} {student.last_name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.roll_number}</TableCell>
                <TableCell>{student.class_grade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button 
          variant="outlined"
          onClick={() => setPage(page - 1)} 
          disabled={page === 1}
        >
          Previous
        </Button>
        
        <Typography>
          Page {page} of {totalPages}
        </Typography>
        
        <Button 
          variant="outlined"
          onClick={() => setPage(page + 1)} 
          disabled={page >= totalPages}
        >
          Next
        </Button>

        <Button 
          variant="contained"
          onClick={handleBack}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Typography sx={{ mt: 2 }}>
        Total: {allStudents.length} students
      </Typography>
    </Box>
  );
}