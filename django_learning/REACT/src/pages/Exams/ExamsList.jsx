import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

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
    navigate(`/take-exam/${examId}`);
  };

  // Calculate pagination on frontend
  const startIndex = (page - 1) * 5;
  const endIndex = startIndex + 5;
  const currentExams = allExams.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allExams.length / 5);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Available Exams</h2>
      
      <table border="1" style={{width: '100%'}}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Duration</th>
            <th>Total Marks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentExams.map(exam => (
            <tr key={exam.id}>
              <td>{exam.title}</td>
              <td>{exam.subject}</td>
              <td>{exam.duration_minutes} mins</td>
              <td>{exam.total_marks}</td>
              <td>
                <button 
                  onClick={() => handleStartExam(exam.id)}
                  style={{ padding: '5px 10px' }}
                >
                  Start Exam
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button 
          onClick={() => setPage(page - 1)} 
          disabled={page === 1}
        >
          Previous
        </button>
        
        <span> Page {page} of {totalPages} </span>
        
        <button 
          onClick={() => setPage(page + 1)} 
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>

      <div style={{marginBottom:'20px',marginTop:'30px'}}>
        <button onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>

      <p>Total: {allExams.length} exams</p>
    </div>
  );
}