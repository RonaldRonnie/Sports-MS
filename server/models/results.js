const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  players: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    score: Number,
    position: Number
  }],
  date: {
    type: Date,
    required: true
  },
  venue: String,
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed'],
    default: 'Scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Result', resultSchema);