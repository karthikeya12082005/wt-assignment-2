const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // ✅ Added CORS
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // ✅ Allow CORS
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);

// MongoDB Connection
mongoose.connect('your_mongoDB_connection_URI_here', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  // Start server after DB connection
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});
