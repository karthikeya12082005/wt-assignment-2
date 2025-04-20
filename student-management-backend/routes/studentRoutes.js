const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

// Add route logging for debugging
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.path}`);
  next();
});

// GET all students
router.route('/')
  .get(getStudents)
  .post(createStudent);

// Student ID parameter validation middleware
router.param('id', (req, res, next, id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  next();
});

// Single student operations
router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
