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

const corsOptions = {
  origin: [
    'https://wt-assignment-2.vercel.app',
    'https://wt-assignment-2-*.vercel.app' // Wildcard for all preview deployments
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests
app.options('*', cors(corsOptions))

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
