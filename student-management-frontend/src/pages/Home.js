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
      const response = await axios.get('https://student-management-backend-s2a1.onrender.com/api/students');
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
        const response = await axios.delete(`https://student-management-backend-s2a1.onrender.com/api/students/${id}`);
        setMessage('Student deleted successfully');
        fetchStudents();
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } catch (error) {
        let errorMessage = 'Failed to delete student: Server Error';
        if (error.response) {
          errorMessage = `Failed to delete student: ${error.response.data.message || error.response.statusText}`;
        } else if (error.request) {
          errorMessage = 'Failed to delete student: No response from server';
        } else {
          errorMessage = `Failed to delete student: ${error.message}`;
        }
        setError(errorMessage);
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
