const mongoose = require('mongoose');

const officialSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['Principal', 'Tutor', 'Coach'], // Restrict to these roles
    required: true 
  },
  school: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'School', 
    required: true // Links the official to a school
  },
  contact: { 
    type: String, 
    required: false // Optional, e.g., phone or email
  },
  createdAt: {
    type: Date, 
    default: Date.now
  }
});

// Create and export the Official model
const Official = mongoose.model('Official', officialSchema);
module.exports = Official;