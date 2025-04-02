const mongoose = require('mongoose');

// Define the Player Schema
const playerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  registrationNumber: { 
    type: String, 
    required: true, 
    unique: true // Ensures no duplicate registration numbers
  },
  school: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'School', 
    required: true 
  },
  age: { 
    type: Number, 
    required: true 
  },
  games: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Game' 
  }],
  position: { 
    type: String, 
    default: 'Unknown' 
  },
  image: { 
    type: String, 
    required: false // Optional, since not all players might have an image initially
  },
  createdAt: {
    type: Date, 
    default: Date.now
  }
});

// Create and export the Player model
const Player = mongoose.model('Player', playerSchema);
module.exports = Player;