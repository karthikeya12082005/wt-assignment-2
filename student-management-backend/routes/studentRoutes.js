const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

// GET all students
router.get('/', getStudents);

// GET single student
router.get('/:id', getStudentById);

// POST create student
router.post('/', createStudent);

// PUT update student
router.put('/:id', updateStudent);

// DELETE student
router.delete('/:id', deleteStudent);

module.exports = router;
