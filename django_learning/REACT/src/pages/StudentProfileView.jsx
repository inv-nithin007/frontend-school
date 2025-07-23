import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

export default function StudentProfileView() {
  
  const navigate = useNavigate();
 


 const userData = JSON.parse(localStorage.getItem('user'));


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

  return (
    <div style={{ maxWidth: 600, margin: '0 auto'}}>
      <div style={{textAlign:'center'}}>
      <h1>Your Assigned Teacher</h1>
      </div>
      
      {userData.assigned_teacher_name ? (
        <div style={{ padding: 20, borderRadius: 20,backgroundColor:'gray'}}>
          <h2>Your Teacher:  {userData.assigned_teacher_name}</h2>
         
          

        </div>
      ) : (
        <div style={{ padding: 20, borderRadius: 8, textAlign: 'center', backgroundColor: '#fff3cd'}}>
          <h3>No Teacher Assigned</h3>
          <p>You don't have any teacher assigned yet. Please contact the admin.</p>
        </div>
      )}

  

    
      <div style={{marginTop: 10, padding: 1,borderRadius:20,textAlign:'center', backgroundColor: 'grey', fontSize: '20px'}}>
        
        <p>Student: {userData.first_name} {userData.last_name}</p>
        <p>Roll Number: {userData.roll_number}</p>
        <p>Class: {userData.class_grade}</p>
        <p>DOB: {userData.date_of_birth}</p>
      </div>
          <div style={{marginTop: 30}}>
        <button onClick={handleBack} style={{padding: '10px', fontSize: '20px'}}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
} 