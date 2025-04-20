// StudentCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const StudentCard = ({ student, onDelete }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`student-card ${!student.isActive ? 'inactive' : ''}`}>
      <div className="student-id-large">
        ID : {student.studentId}
      </div>
      <div className="student-header">
        <h3>{student.firstName} {student.lastName}</h3>
        {!student.isActive && <span className="status-badge">Inactive</span>}
      </div>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>DOB:</strong> {formatDate(student.dob)}</p>
      <p><strong>Department:</strong> {student.department}</p>
      <p><strong>Enrolled:</strong> {student.enrollmentYear}</p>
      <div className="card-actions">
        <Link to={`/edit/${student._id}`} className="btn-edit">Edit</Link>
        <button 
          onClick={() => onDelete(student._id)} 
          className="btn-delete"
          aria-label={`Delete ${student.firstName} ${student.lastName}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default StudentCard;
