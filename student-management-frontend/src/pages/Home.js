// pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StudentCard from '../components/StudentCard';

const Home = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch students');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        console.log('Deleting student with ID:', id);
        const response = await axios.delete(`http://localhost:5000/api/students/${id}`);
        console.log('Delete response:', response.data);
        
        setMessage('Student deleted successfully');
        // Refresh the student list
        fetchStudents();
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } catch (error) {
        console.error('Delete error:', error);
        
        // More detailed error handling
        let errorMessage = 'Failed to delete student: Server Error';
        
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
          errorMessage = `Failed to delete student: ${error.response.data.message || error.response.statusText}`;
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
          errorMessage = 'Failed to delete student: No response from server';
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
          errorMessage = `Failed to delete student: ${error.message}`;
        }
        
        setError(errorMessage);
        
        // Clear error after 3 seconds
        setTimeout(() => {
          setError('');
        }, 5000);
      }
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Student Management System</h1>
        <Link to="/add" className="btn-add">Add New Student</Link>
      </div>
      
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {loading ? (
        <p>Loading...</p>
      ) : students.length > 0 ? (
        <div className="student-list">
          {students.map(student => (
            <StudentCard 
              key={student._id} 
              student={student} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <p>No students found. Click "Add New Student" to create one.</p>
      )}
    </div>
  );
};

export default Home;