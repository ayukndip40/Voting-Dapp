const mongoose = require('mongoose');

// Get MongoDB URI from environment variables
const db = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    // Attempting to connect to MongoDB
    await mongoose.connect(db);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed on app termination');
  process.exit(0);
});

module.exports = connectDB;
