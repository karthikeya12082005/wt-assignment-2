import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://student-management-backend-s2a1.onrender.com/api/students';

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
          const response = await axios.get(`${API_BASE_URL}/${id}`);
          const student = response.data;
          
          // Format the date for the date input (YYYY-MM-DD)
          const formattedDate = student.dob ? new Date(student.dob).toISOString().split('T')[0] : '';
          
          setFormData({
            ...student,
            dob: formattedDate
          });
          setLoading(false);
        } catch (error) {
          console.error('Error fetching student:', error);
          setError('Failed to fetch student details. ' + (error.response?.data?.message || error.message));
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
      setError('');

      // Make sure all required fields are present
      const requiredFields = ['studentId', 'firstName', 'lastName', 'email', 'dob', 'department', 'enrollmentYear'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Format the data properly for the API
      const formattedData = {
        ...formData,
        enrollmentYear: Number(formData.enrollmentYear), // Ensure enrollmentYear is a number
        dob: new Date(formData.dob).toISOString() // Format date for API
      };
      
      console.log('Submitting student data:', formattedData);
      
      let response;
      
      if (isEditing && id) {
        // Update existing student
        response = await axios.put(`${API_BASE_URL}/${id}`, formattedData);
        console.log('Student updated:', response.data);
      } else {
        // Create new student
        response = await axios.post(API_BASE_URL, formattedData);
        console.log('Student created:', response.data);
      }
      
      // Navigate back to home page on success
      navigate('/');
    } catch (error) {
      console.error('Form submission error:', error);
      
      let errorMessage = 'Failed to save student';
      
      if (error.response) {
        // Server responded with an error
        const serverError = error.response.data;
        errorMessage = serverError.message || JSON.stringify(serverError);
        
        if (serverError.errors) {
          const validationErrors = Object.values(serverError.errors)
            .map(err => err.message || err)
            .join(', ');
          
          if (validationErrors) {
            errorMessage = validationErrors;
          }
        }
      } else if (error.message) {
        // Local error (e.g., network issue)
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
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
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
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
