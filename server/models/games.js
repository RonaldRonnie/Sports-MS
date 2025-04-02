// server/models/games.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  type: {
    type: String,
    enum: ['Individual', 'Team'],
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  rules: {
    type: String,
    required: false,
  },
  maxPlayers: {
    type: Number,
    required: true,
  },
  minPlayers: {
    type: Number,
    required: true,
  },
  date: { 
    type: Date, 
    required: false, // Made optional for now
  },
  createdAt: {
    type: Date, 
    default: Date.now,
  },
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;