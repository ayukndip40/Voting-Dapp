//server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware setup
app.use(cors({
  origin: 'http://localhost:5173'  // or use '*' to allow all origins
}));
app.use(express.json()); // Body parser
app.use(cookieParser()); // Cookie parser


// Connect to the database
connectDB();

// Define Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/votes', require('./src/routes/voteRoutes'));
app.use('/api/elections', require('./src/routes/electionRoutes'));
app.use('/api/candidates', require('./src/routes/candidateRoutes'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));