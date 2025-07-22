import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

export default function TeacherStudentsView() {
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      
      const teacherResponse = await axios.get('/api/teachers/');
      const teachers = teacherResponse.data.results;
      
      
      const userData = JSON.parse(localStorage.getItem('user'));
      const currentTeacher = teachers.find(teacher => 
        teacher.email === userData.email
      );

      
      const studentsResponse = await axios.get(`/api/teachers/${currentTeacher.id}/students/`);
      setAllStudents(studentsResponse.data);
      
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

  // Calculate pagination on frontend
  const startIndex = (page - 1) * 5;
  const endIndex = startIndex + 5;
  const currentStudents = allStudents.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allStudents.length / 5);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>My Students</h2>
      
      <table border="1" style={{width: '100%'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roll Number</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map(s => (
            <tr key={s.id}>
              <td>{s.first_name} {s.last_name}</td>
              <td>{s.email}</td>
              <td>{s.roll_number}</td>
              <td>{s.class_grade}</td>
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

      <p>Total: {allStudents.length} students</p>
    </div>
  );
}