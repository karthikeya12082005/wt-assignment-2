const Student = require('../models/Student');

// @desc    Get all students
// @route   GET /api/students
// @access  Public
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Public
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Public
exports.createStudent = async (req, res) => {
  try {
    const { studentId, firstName, lastName, email, dob, department, enrollmentYear, isActive } = req.body;
    
    // Check if student with email or studentId already exists
    const existingStudent = await Student.findOne({ $or: [{ email }, { studentId }] });
    
    if (existingStudent) {
      return res.status(400).json({ 
        message: existingStudent.email === email 
          ? 'Student with this email already exists' 
          : 'Student with this ID already exists'
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
      isActive: isActive !== undefined ? isActive : true
    });
    
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Public
exports.updateStudent = async (req, res) => {
  try {
    const { studentId, firstName, lastName, email, dob, department, enrollmentYear, isActive } = req.body;
    
    let student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if new email or studentId conflicts with other students
    if (email !== student.email || studentId !== student.studentId) {
      const existingStudent = await Student.findOne({
        $and: [
          { _id: { $ne: req.params.id } }, // Exclude current student
          { $or: [{ email }, { studentId }] }
        ]
      });
      
      if (existingStudent) {
        return res.status(400).json({ 
          message: existingStudent.email === email 
            ? 'Another student with this email already exists' 
            : 'Another student with this ID already exists'
        });
      }
    }
    
    student = await Student.findByIdAndUpdate(
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
    
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Public
exports.deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid student ID format' });
    }
    
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.toString() });
  }
};