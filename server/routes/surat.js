const express = require('express');
const router = express.Router();
const Surat = require('../models/Surat');
// Middleware autentikasi diasumsikan sudah ada (verifyToken)

// 1. Ajukan Surat (Warga)
router.post('/', async (req, res) => {
  try {
    const newSurat = new Surat({
      pemohon: req.body.userId, // Dari token/session
      jenisSurat: req.body.jenisSurat,
      keterangan: req.body.keterangan
    });
    const savedSurat = await newSurat.save();
    res.json(savedSurat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Validasi Surat (Hanya Admin/RT)
router.put('/validasi/:id', async (req, res) => {
  try {
    const updatedSurat = await Surat.findByIdAndUpdate(
      req.params.id,
      { 
        status: req.body.status, // 'disetujui' atau 'ditolak'
        tanggalValidasi: Date.now() 
      },
      { new: true }
    );
    res.json(updatedSurat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Ambil Semua Surat (Untuk Dashboard Admin)
router.get('/', async (req, res) => {
  try {
    const surats = await Surat.find().populate('pemohon', 'username');
    res.json(surats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;