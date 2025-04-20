// studentController.js
// student-management-backend/controllers/studentController.js

const Student = require('../models/Student');

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Public
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// @desc    Create student
// @route   POST /api/students
// @access  Public
const createStudent = async (req, res) => {
  try {
    const { studentId, firstName, lastName, email, dob, department, enrollmentYear } = req.body;

    // Validate required fields
    if (!studentId || !firstName || !lastName || !email || !dob || !department || !enrollmentYear) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if studentId or email already exists
    const existingStudent = await Student.findOne({ 
      $or: [{ studentId }, { email }] 
    });

    if (existingStudent) {
      return res.status(400).json({ 
        message: existingStudent.studentId === studentId 
          ? 'Student ID already exists' 
          : 'Email already exists'
      });
    }

    const student = await Student.create({
      studentId,
      firstName,
      lastName,
      email,
      dob: new Date(dob),
      department,
      enrollmentYear,
      isActive: true
    });

    res.status(201).json(student);
  } catch (error) {
    console.error('Create Student Error:', error);
    res.status(400).json({
      message: error.message,
      errors: error.errors // Mongoose validation errors
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = async (req, res) => {
  try {
    const { studentId, firstName, lastName, email, dob, department, enrollmentYear, isActive } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check for duplicate studentId or email
    if (studentId !== student.studentId || email !== student.email) {
      const existingStudent = await Student.findOne({
        $and: [
          { _id: { $ne: req.params.id } }, // Exclude current student
          { $or: [{ studentId }, { email }] }
        ]
      });

      if (existingStudent) {
        return res.status(400).json({
          message: existingStudent.studentId === studentId
            ? 'Student ID already exists'
            : 'Email already exists'
        });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        studentId,
        firstName,
        lastName,
        email,
        dob: new Date(dob),
        department,
        enrollmentYear,
        isActive
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Update Student Error:', error);
    res.status(400).json({
      message: error.message,
      errors: error.errors
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete Student Error:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
