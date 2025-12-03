const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Letter = require('../models/Letter');
const { protect } = require('../middleware/authMiddleware');

// @route GET /api/dashboard/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const wargaCount = await User.countDocuments({ role: 'warga' });
    const pendingLetters = await Letter.countDocuments({ status: 'pending' });
    const approvedLetters = await Letter.countDocuments({ status: 'approved_rt' });
    
    res.json({ wargaCount, pendingLetters, approvedLetters });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;