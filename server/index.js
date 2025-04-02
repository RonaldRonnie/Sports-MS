require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI; // Get from .env
console.log("Connecting to MongoDB:", MONGO_URI); // Debugging

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Import Routes
const gamesRoutes = require('./routes/games');
const playersRoutes = require('./routes/players');
const resultsRoutes = require('./routes/results');

// Use Routes
app.use('/api/games', gamesRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/results', resultsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
