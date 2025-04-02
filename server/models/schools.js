// server/models/schools.js
const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: false 
  },
  principal: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Official', 
    required: false 
  },
  tutor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Official', 
    required: false 
  },
  coaches: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Official' 
  }],
  games: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Game' 
  }],
  createdAt: {
    type: Date, 
    default: Date.now
  }
});

const School = mongoose.model('School', schoolSchema);
module.exports = School;