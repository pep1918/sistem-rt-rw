const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route GET /api/users (Untuk admin melihat daftar warga)
router.get('/', protect, async (req, res) => {
  // Hanya RT/RW yang boleh lihat daftar user
  if (req.user.role === 'warga') {
      return res.status(403).json({ message: 'Not authorized' });
  }
  const users = await User.find({ role: 'warga' }).select('-password');
  res.json(users);
});

module.exports = router;