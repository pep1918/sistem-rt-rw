// backend/routes/complaintRoutes.js
const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect } = require('../middleware/authMiddleware');

// 1. BUAT ADUAN (Warga)
router.post('/', protect, async (req, res) => {
  const { title, description, location, priority } = req.body;
  try {
    const complaint = await Complaint.create({
      user: req.user._id,
      title, description, location, priority
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. AMBIL SEMUA ADUAN
router.get('/', protect, async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'warga') {
      // Warga hanya lihat aduan sendiri
      complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    } else {
      // RT lihat semua aduan + data pelapor
      complaints = await Complaint.find({}).populate('user', 'name nik').sort({ createdAt: -1 });
    }
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. UPDATE STATUS & RESPON (RT Only)
router.put('/:id', protect, async (req, res) => {
  if (req.user.role === 'warga') return res.status(403).json({ message: 'Ditolak' });

  try {
    const { status, response } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, response },
      { new: true }
    );
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;