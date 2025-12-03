const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit'); // Library untuk PDF
const Letter = require('../models/Letter');
const { protect } = require('../middleware/authMiddleware');


router.get('/', protect, async (req, res) => {
  try {
    let letters;
    if (req.user.role === 'warga') {
      // Jika Warga, hanya ambil surat miliknya sendiri
      letters = await Letter.find({ user: req.user._id })
        .sort({ createdAt: -1 }); // Urutkan dari yang terbaru
    } else {
      // Jika RT, ambil semua surat + data nama pengajunya
      letters = await Letter.find({})
        .populate('user', 'name nik') // Ambil field name dan nik dari User
        .sort({ createdAt: -1 });
    }
    res.json(letters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  const { type, description } = req.body;

  try {
    const letter = await Letter.create({
      user: req.user._id, // Ambil ID dari token login
      type,
      description,
    });
    res.status(201).json(letter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/:id', protect, async (req, res) => {
  try {
    // Cek Role
    if (req.user.role === 'warga') {
      return res.status(403).json({ message: 'Akses ditolak. Hanya untuk pengurus RT.' });
    }

    const letter = await Letter.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true } // Return data yang sudah diupdate
    );

    if (!letter) {
      return res.status(404).json({ message: 'Surat tidak ditemukan' });
    }

    res.json(letter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/download', protect, async (req, res) => {
  try {
    // Cari surat dan data detail user (Nama, NIK, Alamat wajib ada untuk PDF)
    const letter = await Letter.findById(req.params.id).populate('user', 'name nik address');

    if (!letter) {
      return res.status(404).json({ message: 'Surat tidak ditemukan' });
    }

    // Validasi Akses: Hanya boleh didownload oleh Pemilik atau Ketua RT
    if (req.user.role !== 'rt' && letter.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Anda tidak berhak mendownload surat ini.' });
    }

    // Validasi Status: Harus sudah disetujui
    if (letter.status !== 'approved_rt') {
      return res.status(400).json({ message: 'Surat belum disetujui oleh RT.' });
    }

    // --- MULAI GENERATE PDF ---
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Header Response (Agar browser tahu ini file download)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Surat-${letter.type.replace(/\s/g, '-')}.pdf`);

    // Sambungkan PDF langsung ke response browser
    doc.pipe(res);

    // --- DESAIN KOP SURAT ---
    doc.font('Helvetica-Bold').fontSize(18).text('RUKUN TETANGGA 01 / RW 05', { align: 'center' });
    doc.font('Helvetica').fontSize(12).text('Kelurahan Digital, Kecamatan Teknologi, Kota Internet', { align: 'center' });
    doc.moveDown(0.5);
    // Garis bawah kop surat
    doc.lineWidth(2).moveTo(50, 100).lineTo(545, 100).stroke();
    
    doc.moveDown(2);

    // --- JUDUL SURAT ---
    doc.font('Helvetica-Bold').fontSize(14).text(letter.type.toUpperCase(), { align: 'center', underline: true });
    // Nomor surat dummy (mengambil 8 karakter ID unik)
    doc.font('Helvetica').fontSize(10).text(`Nomor: ${letter._id.toString().substring(0, 8)}/RT/2025`, { align: 'center' });

    doc.moveDown(2);

    // --- ISI SURAT ---
    doc.font('Helvetica').fontSize(12).text('Yang bertanda tangan di bawah ini, Ketua RT 01 RW 05 menerangkan bahwa:', { align: 'justify' });
    doc.moveDown();

    // Data Diri Warga
    const leftMargin = 70;
    const infoGap = 100;

    doc.text('Nama', leftMargin, doc.y);
    doc.text(`: ${letter.user.name}`, leftMargin + infoGap, doc.y - 12);
    
    doc.text('NIK', leftMargin, doc.y + 10);
    doc.text(`: ${letter.user.nik}`, leftMargin + infoGap, doc.y - 12);

    doc.text('Alamat', leftMargin, doc.y + 10);
    doc.text(`: ${letter.user.address}`, leftMargin + infoGap, doc.y - 12);

    doc.moveDown(2);

    // Keterangan Isi
    doc.text('Adalah benar-benar warga penduduk lingkungan kami yang saat ini berdomisili di alamat tersebut di atas.', { align: 'justify' });
    doc.moveDown();
    
    doc.text(`Surat keterangan ini dibuat untuk keperluan:`, { align: 'justify' });
    doc.font('Helvetica-Bold').text(`"${letter.description}"`, { align: 'center' });
    doc.font('Helvetica').moveDown();

    doc.text('Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.', { align: 'justify' });

    doc.moveDown(4);

    // --- TANDA TANGAN ---
    const tanggal = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    
    // Posisi tanda tangan di kanan
    doc.text(`Surabaya, ${tanggal}`, 350, doc.y);
    doc.text('Ketua RT 01', 350, doc.y + 5);
    
    doc.moveDown(4);
    doc.font('Helvetica-Bold').text('( Bpk. Ketua RT )', 350, doc.y, { underline: true });

    // Selesai (Finalisasi PDF)
    doc.end();

  } catch (error) {
    console.error('PDF Error:', error);
    res.status(500).json({ message: 'Gagal membuat file PDF' });
  }
});

module.exports = router;