const mongoose = require('mongoose');

const announcementSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  eventDate: { type: Date }, // <--- TAMBAHAN: Tanggal Acara
  author: { type: String, default: 'Pengurus RT' },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);