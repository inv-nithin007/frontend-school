import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentTeacherView() {
  const navigate = useNavigate();
  
  
  const userData = JSON.parse(localStorage.getItem('user'));
  
  const handleBack = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.role === 'admin') {
      navigate('/admin-dashboard'); 
    } else if (user.role === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  return (
    <div style={{padding: 20, maxWidth: 600, margin: '0 auto'}}>
      <div style={{textAlign:'center'}}>
      <h1>Your Assigned Teacher</h1>
      </div>
      
      {userData.assigned_teacher_name ? (
        <div style={{ padding: 20, borderRadius: 20,backgroundColor:'gray'}}>
          <h2>{userData.assigned_teacher_name}</h2>
          <p><strong>Email:</strong> {userData.assigned_teacher_email}</p>
          <p><strong>Phone:</strong> {userData.assigned_teacher_phone}</p>
          <p><strong>Subject:</strong> {userData.assigned_teacher_subject}</p>
          <p><strong>Qualification:</strong> {userData.assigned_teacher_qualification}</p>
          <p><strong>Experience:</strong> {userData.assigned_teacher_experience} years</p>
        </div>
      ) : (
        <div style={{ padding: 20, borderRadius: 8, textAlign: 'center', backgroundColor: '#fff3cd'}}>
          <h3>No Teacher Assigned</h3>
          <p>You don't have any teacher assigned yet. Please contact the admin.</p>
        </div>
      )}

      <div style={{marginTop: 30}}>
        <button onClick={handleBack} style={{padding: '10px', fontSize: '20px'}}>
          Back to Dashboard
        </button>
      </div>

    
     
    </div>
  );
}