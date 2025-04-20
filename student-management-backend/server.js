const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware - Remove duplicate express.json()
app.use(express.json());
app.use(cors({
  origin: ['https://wt-assignment-2.vercel.app'] // Array format for multiple origins
}));

// Routes
app.use('/api/students', require('./routes/studentRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 10000; // Must match Render's PORT variable

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
