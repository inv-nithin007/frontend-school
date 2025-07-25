import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
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

export default function ExamsList() {
  const [allExams, setAllExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/exams/');
      const examsData = response.data.results;
      setAllExams(examsData);
    } catch (error) {
      console.log('Error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  
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

  const handleStartExam = (examId) => {
    navigate(`/attend/${examId}`);
  };

  // Calculate pagination on frontend
  const startIndex = (page - 1) * 5;
  const endIndex = startIndex + 5;
  const currentExams = allExams.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allExams.length / 5);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, maxWidth: 1000, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom textAlign='center'>
        Available Exams
      </Typography>
      <Paper elevation={15}>
      <TableContainer >
        <Table >
          <TableHead >
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Subject</strong></TableCell>
              <TableCell><strong>Duration</strong></TableCell>
              <TableCell><strong>Total Marks</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentExams.map(exam => (
              <TableRow key={exam.id}>
                <TableCell>{exam.title}</TableCell>
                <TableCell>{exam.subject}</TableCell>
                <TableCell>{exam.duration_minutes} mins</TableCell>
                <TableCell>{exam.total_marks}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained"
                    color="primary"
                    onClick={() => handleStartExam(exam.id)}
                    size="small"
                  >
                    Start Exam
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
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
        Total: {allExams.length} exams
      </Typography>
    </Box>
  );
}