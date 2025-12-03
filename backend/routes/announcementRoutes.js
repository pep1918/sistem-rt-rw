const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect } = require('../middleware/authMiddleware');

// GET: Semua Pengumuman
router.get('/', protect, async (req, res) => {
  const news = await Announcement.find({}).sort({ createdAt: -1 });
  res.json(news);
});

// POST: Buat Pengumuman (RT Only)
router.post('/', protect, async (req, res) => {
  if (req.user.role === 'warga') return res.status(403).json({message: 'Ditolak'});
  const news = await Announcement.create(req.body);
  res.status(201).json(news);
});

module.exports = router;