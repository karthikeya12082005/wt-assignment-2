// student-management-backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://wt-assignment-2.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
// Routes
app.use('/api/students', require('./routes/studentRoutes'));

app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'API is running',
    docs: '/api-docs' // If you have documentation
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});
