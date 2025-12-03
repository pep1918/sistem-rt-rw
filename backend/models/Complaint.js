// backend/models/Complaint.js
const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true }, // Lokasi kejadian
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'resolved', 'rejected'], 
    default: 'pending' 
  },
  response: { type: String }, // Tanggapan RT
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);