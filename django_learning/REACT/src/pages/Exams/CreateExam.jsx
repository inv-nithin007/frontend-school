import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Paper,
  MenuItem
} from '@mui/material';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

export default function CreateExam() {
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  
  const examForm = useForm();
  
  
  const questionForm = useForm({
    defaultValues: {
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      marks: 1
    }
  });

  const addQuestion = (data) => {
    if (data.question_text === '' || data.option_a === '' || data.option_b === '') {
      setMessage('Please fill question text and at least 2 options');
      return;
    }

    // Add new question to list
    const newQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      newQuestions.push(questions[i]);
    }
    newQuestions.push(data);
    setQuestions(newQuestions);

    // Clear the form
    questionForm.reset();
    setMessage('Question added successfully!');
  };

  const removeQuestion = (indexToRemove) => {
    const newQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      if (i !== indexToRemove) {
        newQuestions.push(questions[i]);
      }
    }
    setQuestions(newQuestions);
    setMessage('Question removed');
  };

  const createExam = async (examData) => {
    if (questions.length === 0) {
      setMessage('Please add at least 1 question');
      return;
    }

    try {
      // Create exam first
      const examResponse = await axios.post('/api/exams/', examData);
      const examId = examResponse.data.id;
      
      // Add each question
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        await axios.post('/api/questions/', {
          question_text: question.question_text,
          option_a: question.option_a,
          option_b: question.option_b,
          option_c: question.option_c,
          option_d: question.option_d,
          correct_answer: question.correct_answer,
          marks: question.marks,
          exam: examId
        });
      }
      
      setMessage('Exam created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/teacher-dashboard');
      }, 2000);
      
    } catch (error) {
      setMessage('Error creating exam');
    }
  };

  return (
    
    
    <Box maxWidth="900px" margin="0 auto" padding={3}>


    

      
      <Typography variant="h4" align="center" gutterBottom>
        Create New Exam
      </Typography>
      
      {message && (
        <Alert 
          
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}
      
     
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" >Exam Details</Typography>
        <form onSubmit={examForm.handleSubmit(createExam)}>
          
          <TextField
            {...examForm.register('title', { 
              required: 'Title is required',
              minLength: {
                value: 3,
                message: 'Title too short'
              }
            })}
            fullWidth
            label="Title"
            placeholder="Enter exam title"
            error={!!examForm.formState.errors.title}
            helperText={examForm.formState.errors.title?.message}
            sx={{ mb: 2 }}
          />
          
          <TextField
            {...examForm.register('description')}
            fullWidth
            label="Description"
            placeholder="Enter exam description"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              {...examForm.register('subject', { required: 'Subject is required' })}
              fullWidth
              label="Subject"
              placeholder="e.g., Mathematics"
              error={!!examForm.formState.errors.subject}
              helperText={examForm.formState.errors.subject?.message}
            />
            <TextField
              {...examForm.register('duration_minutes', { 
                required: 'Duration is required',
                min: {
                  value: 1,
                  message: 'Duration must be positive'
                }
              })}
              fullWidth
              type="number"
              label="Duration (minutes)"
              placeholder="e.g., 60"
              error={!!examForm.formState.errors.duration_minutes}
              helperText={examForm.formState.errors.duration_minutes?.message}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              {...examForm.register('total_marks', { 
                required: 'Total marks is required',
                min: {
                  value: 1,
                  message: 'Total marks must be positive'
                }
              })}
              fullWidth
              type="number"
              label="Total Marks"
              placeholder="e.g., 100"
              error={!!examForm.formState.errors.total_marks}
              helperText={examForm.formState.errors.total_marks?.message}
            />
            <TextField
              {...examForm.register('passing_marks', { 
                required: 'Passing marks is required',
                min: {
                  value: 0,
                  message: 'Passing marks cannot be negative'
                }
              })}
              fullWidth
              type="number"
              label="Passing Marks"
              placeholder="e.g., 40"
              error={!!examForm.formState.errors.passing_marks}
              helperText={examForm.formState.errors.passing_marks?.message}
            />
          </Box>
          
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            disabled={questions.length === 0}
          >
            Create Exam ({questions.length} questions)
          </Button>
        </form>
      </Paper>

      
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" >Add Questions</Typography>
        <form onSubmit={questionForm.handleSubmit(addQuestion)}>
          
          <TextField
            {...questionForm.register('question_text', { 
              required: 'Question text is required',
              minLength: {
                value: 5,
                message: 'Question too short'
              }
            })}
            fullWidth
            label="Question"
            placeholder="Enter your question here..."
            multiline
            rows={4}
            error={!!questionForm.formState.errors.question_text}
            helperText={questionForm.formState.errors.question_text?.message}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              {...questionForm.register('option_a', { required: 'Option A is required' })}
              fullWidth
              label="Option A"
              placeholder="Option A"
              error={!!questionForm.formState.errors.option_a}
              helperText={questionForm.formState.errors.option_a?.message}
            />
            <TextField
              {...questionForm.register('option_b', { required: 'Option B is required' })}
              fullWidth
              label="Option B"
              placeholder="Option B"
              error={!!questionForm.formState.errors.option_b}
              helperText={questionForm.formState.errors.option_b?.message}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              {...questionForm.register('option_c')}
              fullWidth
              label="Option C (optional)"
              placeholder="Option C"
            />
            <TextField
              {...questionForm.register('option_d')}
              fullWidth
              label="Option D (optional)"
              placeholder="Option D"
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              {...questionForm.register('correct_answer'
               )}
              select
              label="Correct Answer"
              error={!!questionForm.formState.errors.correct_answer}
              helperText={questionForm.formState.errors.correct_answer?.message}
              sx={{ minWidth: 150,maxWidth:500 }}
              
            >
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
              <MenuItem value="D">D</MenuItem>
            </TextField>
            <TextField
              {...questionForm.register('marks', {
                min: {
                  value: 1,
                  message: 'Marks must be at least 1'
                }
              })}
              type="number"
              label="Marks"
              error={!!questionForm.formState.errors.marks}
              helperText={questionForm.formState.errors.marks?.message}
              sx={{ minWidth: 100 }}
            />
          </Box>
          
          <Button type="submit" variant="contained" color="success">
            Add Question
          </Button>
        </form>
      </Paper>

      
      {questions.length > 0 && (
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {questions.length} Questions Added 
          </Typography>
          {questions.map((question, index) => (  
  <Paper elevation={10} sx={{ p: 2, mb: 2 }}>
    <Box display="flex">
      <Box>
        <Typography>{question.question_text}</Typography>
      </Box>
                <Button 
                  onClick={() => removeQuestion(index)}
                  variant="outlined"
                  color="error"
                  size="small"
                >
                  Remove
                </Button>
              </Box>
            </Paper>
          ))}
        </Paper>
      )}

      
      <Box textAlign="center">
        <Button 
          onClick={() => navigate('/teacher-dashboard')}
          variant="outlined"
          size="large"
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
}