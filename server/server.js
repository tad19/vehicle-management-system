const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Bypasses local network/ISP DNS blocks for MongoDB Atlas

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log("Checking MONGO_URI:", MONGO_URI ? "Loaded successfully" : "UNDEFINED!");

// Connect to MongoDB Atlas & Start Server
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection error details:', err.message);
  });