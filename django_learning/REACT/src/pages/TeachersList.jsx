import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom'; 

export default function TeachersList() {
  const [allTeachers, setAllTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate=useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/teachers/');
      const teachersData = response.data.results;
      setAllTeachers(teachersData);
    } catch (error) {
      console.log('Error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate pagination on frontend
  const startIndex = (page - 1) * 5;
  const endIndex = startIndex + 5;
  const currentTeachers = allTeachers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allTeachers.length / 5);

  const handleBack=()=>{
    const userData=localStorage.getItem('user')
    if(userData)
    {
      const user=JSON.parse(userData)
      if (user.role=='admin')
      {
         navigate('/admin-dashboard'); 
      }
      else if (user.role === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      navigate('/student-dashboard');
    }
    }
  }
  if (loading) return <div>Loading...</div>;

  return (
    <div style={{padding:16,maxWidth:900,margin:'0 auto'}}>
      <h2>Teachers</h2>
      
      <table border="1" style={{width: '100%'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            
          </tr>
        </thead>
        <tbody>
          {currentTeachers.map(t => (
            <tr>
              <td>{t.first_name} {t.last_name}</td>
              <td>{t.email}</td>
              <td>{t.subject}</td>
              
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{display:'flex',gap:20,marginTop:16}}>
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

        <button
        onClick={handleBack}
        >back to dashboard</button>
      </div>

      

      <p>Total: {allTeachers.length} teachers</p>
    </div>
  );
}
