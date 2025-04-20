import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const StudentForm = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    department: 'Computer Science',
    enrollmentYear: new Date().getFullYear(),
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isEditing && id) {
      const getStudentData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`https://student-management-backend-s2a1.onrender.com/api/students/${id}`);
          const student = response.data;
          setFormData({
            ...student,
            dob: student.dob.split('T')[0] // Format date for date input
          });
          setLoading(false);
        } catch (error) {
          setError('Failed to fetch student details');
          setLoading(false);
        }
      };
      
      getStudentData();
    }
  }, [isEditing, id]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (isEditing) {
        await axios.put(`https://student-management-backend-s2a1.onrender.com/api/students/${id}`, formData);
      } else {
        await axios.post('https://student-management-backend-s2a1.onrender.com/api/students', formData);
      }
      
      setLoading(false);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 
              (isEditing ? 'Failed to update student' : 'Failed to add student'));
      setLoading(false);
    }
  };
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i);
  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering'];

  return (
    <div className="form-container">
      <h1>{isEditing ? 'Edit Student' : 'Add New Student'}</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="studentId">Student ID</label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            pattern="[a-zA-Z0-9]+"
            title="Alphanumeric characters only"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            minLength="2"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            minLength="2"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="enrollmentYear">Enrollment Year</label>
          <select
            id="enrollmentYear"
            name="enrollmentYear"
            value={formData.enrollmentYear}
            onChange={handleChange}
            required
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label htmlFor="isActive">Active Student</label>
        </div>
        
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Processing...' : (isEditing ? 'Update Student' : 'Add Student')}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
