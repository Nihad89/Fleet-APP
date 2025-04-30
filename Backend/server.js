// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());  // To parse JSON requests

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the Car Rental API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// server.js
const userRoutes = require('./routes/userRoutes');

app.use('/api/users', userRoutes);
