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

app.use(cors({
  origin: [
    'https://wt-assignment-2.vercel.app',
    'https://wt-assignment-2-9zy67mivn-kasam-revan-sai-karthikeyas-projects.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

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
  console.log(`Server running on port ${PORT}`);
});
