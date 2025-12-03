const mongoose = require('mongoose');

const announcementSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Pengurus RT' }, // Nama pembuat
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);