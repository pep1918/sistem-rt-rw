const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { protect } = require('../middleware/authMiddleware');

// GET: Ambil Data Pembayaran
router.get('/', protect, async (req, res) => {
  try {
    let payments;
    if (req.user.role === 'warga') {
      payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
    } else {
      payments = await Payment.find({}).populate('user', 'name').sort({ createdAt: -1 });
    }
    res.json(payments);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST: Bayar Iuran (Warga)
router.post('/', protect, async (req, res) => {
  try {
    const { type, amount, month, proofDescription } = req.body;
    const payment = await Payment.create({
      user: req.user._id, type, amount, month, proofDescription
    });
    res.status(201).json(payment);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT: Verifikasi (RT)
router.put('/:id', protect, async (req, res) => {
  if (req.user.role === 'warga') return res.status(403).json({message: 'Ditolak'});
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, { status: 'verified' }, { new: true });
    res.json(payment);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;