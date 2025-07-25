import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from '../../utils/axios';

export default function Attend() {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [examStarted, setExamStarted] = useState(false); 

  // Start exam
  useEffect(() => {
    const startExam = async () => {
      try {
        
        
        const response = await axios.post(`/api/exams/${examId}/start_exam/`);
        const data = response.data;
        
        
        
        setExamData({
          title: data.exam_title,
          duration: data.duration_minutes,
          totalMarks: data.total_marks
        });
        setQuestions(data.questions);
        setTimeLeft(data.duration_minutes * 60); 
        
        // Initialize answers
        const initialAnswers = {};
        data.questions.forEach(q => {
          initialAnswers[q.id] = '';
        });
        setAnswers(initialAnswers);
        
        setExamStarted(true); 
        
      } catch (error) {
        
        
        if (error.response?.status === 400) {
          const errorData = error.response.data;
          if (errorData.score !== undefined) {
            setError(`You have already completed this exam. Score: ${errorData.score}/${errorData.total_marks || 'N/A'}`);
          } else {
            setError(errorData.error || 'Cannot start exam');
          }
        } else {
          setError(error.response?.data?.error || 'Failed to start exam');
        }
      }
      setLoading(false);
    };

    startExam();
  }, [examId]);


  useEffect(() => {
    if (examStarted && timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (examStarted && timeLeft === 0 && !submitted) {
      
      handleSubmit();
    }
  }, [timeLeft, submitted, examStarted]);

  // Submit exam
  const handleSubmit = async () => {
    if (submitted) return; 
    
    
    setSubmitted(true); 
    
    try {
      const formattedAnswers = Object.entries(answers)
        .map(([questionId, selectedAnswer]) => ({
          question_id: parseInt(questionId),
          selected_answer: selectedAnswer
        }))
        .filter(answer => answer.selected_answer !== '');

     

      const response = await axios.post(`/api/exams/${examId}/submit_exam/`, {
        answers: formattedAnswers
      });
      
      
      setResults(response.data);
      
    } catch (error) {
      
      setError(error.response?.data?.error || error.message || 'Failed to submit exam');
      setSubmitted(false); // Reset if submission failed
    }
  };

  // Handle answer change
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading
  if (loading) {
    return (
      <Box  >
        <CircularProgress />
        <Typography sx={{ ml: 50 }}>Loading exam...</Typography>
      </Box>
    );
  }

  // Error
  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
        <Alert >
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/exam-list')}>
          Back to Exams
        </Button>
      </Box>
    );
  }

  // Results
  if (submitted && results) {
    return (
      <Box sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
        <Paper elevation={10}  sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {results.is_passed ? ' Passed' : 'Failed!'}
          </Typography>
          
          <Typography variant="h6" gutterBottom>
            Score: {results.score} / {results.total_marks}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Correct: {results.correct_answers} / {results.total_questions}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Percentage: {Math.round((results.score / results.total_marks) * 100)}%
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" onClick={() => navigate('/exam-list')} sx={{ mr: 2 }}>
              Back to Exams
            </Button>
            <Button variant="outlined" onClick={() => navigate('/student-dashboard')}>
              Dashboard
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }



  const question = questions[currentQuestion];

  return (
    <Box sx={{ p: 2, maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <Paper elevation={10} sx={{ p: 2, mb: 2}}>
        <Box display={'flex'} justifyContent="space-between">
          <Typography variant="h5">{examData?.title}</Typography>
          <Typography  variant="h6"  color='green'>
            Time: {formatTime(timeLeft)}
          </Typography>
        </Box>
      </Paper>

      
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Question {currentQuestion + 1} of {questions.length}
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          {question.question_text}
        </Typography>
        <RadioGroup
          value={answers[question.id] || ''}
             onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    >
                          
                            {question.option_a && (
                                        <FormControlLabel
                                          value="A"
                                          control={<Radio />}
                                          label={`A) ${question.option_a}`}
                                                                        />
                                                                         )}

                                   
                                            {question.option_b && (
                                                 <FormControlLabel
                                                       value="B"
                                           control={<Radio />}
                                     label={`B) ${question.option_b}`}
                                                                />
                                                                  )}

                                                 
                                            {question.option_c && (
                                            <FormControlLabel
                                              value="C"
                                               control={<Radio />}
                                               label={`C) ${question.option_c}`}
                                                                        />
                                                                        )}

                                                   
                                            {question.option_d && (
                                            <FormControlLabel
                                            value="D"
                                            control={<Radio />}
                                            label={`D) ${question.option_d}`}
                                            />
                                                 )}
          </RadioGroup>
        </Paper>

     
      <Box display="flex" justifyContent="space-between" >
        <Button 
          variant="outlined" 
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <Typography>
          {Object.values(answers).filter(a => a !== '').length} / {questions.length} answered
        </Typography>
        
        {currentQuestion === questions.length - 1 ? (
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleSubmit}
            disabled={submitted}
          >
            {submitted ? 'Submitting...' : 'Submit Exam'}
          </Button>
        ) : (
          <Button 
            variant="outlined" 
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
}