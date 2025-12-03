const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit'); // Library PDF
const Letter = require('../models/Letter');
const { protect } = require('../middleware/authMiddleware');

// ====================================================================
// 1. AMBIL SEMUA SURAT
// Route: GET /api/letters
// ====================================================================
router.get('/', protect, async (req, res) => {
  try {
    let letters;
    if (req.user.role === 'warga') {
      // Warga hanya melihat surat miliknya sendiri
      letters = await Letter.find({ user: req.user._id })
        .sort({ createdAt: -1 });
    } else {
      // RT melihat semua surat + data pengaju
      letters = await Letter.find({})
        .populate('user', 'name nik')
        .sort({ createdAt: -1 });
    }
    res.json(letters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ====================================================================
// 2. AJUKAN SURAT BARU
// Route: POST /api/letters
// ====================================================================
router.post('/', protect, async (req, res) => {
  const { type, description } = req.body;

  try {
    const letter = await Letter.create({
      user: req.user._id,
      type,
      description,
    });
    res.status(201).json(letter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ====================================================================
// 3. UPDATE STATUS SURAT (VALIDASI RT)
// Route: PUT /api/letters/:id
// ====================================================================
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user.role === 'warga') {
      return res.status(403).json({ message: 'Akses ditolak. Hanya untuk RT.' });
    }

    const letter = await Letter.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!letter) {
      return res.status(404).json({ message: 'Surat tidak ditemukan' });
    }

    res.json(letter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ====================================================================
// 4. DOWNLOAD PDF (DENGAN KONTEN DINAMIS)
// Route: GET /api/letters/:id/download
// ====================================================================
router.get('/:id/download', protect, async (req, res) => {
  try {
    const letter = await Letter.findById(req.params.id).populate('user', 'name nik address');

    if (!letter) return res.status(404).json({ message: 'Surat tidak ditemukan' });

    // Cek Hak Akses (Pemilik atau RT)
    if (req.user.role !== 'rt' && letter.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Tidak diizinkan' });
    }

    // Cek Status (Harus Approved)
    if (letter.status !== 'approved_rt') {
      return res.status(400).json({ message: 'Surat belum disetujui, tidak bisa didownload.' });
    }

    // --- LOGIKA KONTEN DINAMIS (Switch Case) ---
    // Menentukan isi paragraf berdasarkan jenis surat
    let contentTitle = letter.type.toUpperCase();
    let contentBody = "";

    switch (letter.type) {
      case 'Surat Pengantar KTP/KK':
        contentBody = "Adalah benar warga kami yang sedang mengajukan permohonan pembuatan atau perpanjangan Kartu Tanda Penduduk (KTP) / Kartu Keluarga (KK).";
        break;
      
      case 'Surat Keterangan Domisili':
        contentBody = "Benar-benar penduduk yang berdomisili dan menetap di lingkungan RT 01 RW 05, Kelurahan Digital. Surat ini dibuat untuk dipergunakan sebagai bukti domisili yang sah.";
        break;

      case 'Surat Keterangan Tidak Mampu (SKTM)':
        contentBody = "Bahwa yang bersangkutan tergolong keluarga kurang mampu (Pra-Sejahtera) di lingkungan kami. Surat ini diterbitkan untuk keperluan pengajuan bantuan sosial/beasiswa/kesehatan.";
        break;

      case 'Surat Keterangan Usaha (SKU)':
        contentBody = `Menerangkan bahwa yang bersangkutan benar-benar memiliki usaha di lingkungan kami dengan detail: "${letter.description}". Surat ini dibuat untuk keperluan administrasi perbankan/izin usaha.`;
        break;

      case 'Surat Pengantar SKCK':
        contentBody = "Adalah warga yang berkelakuan baik, tidak pernah tersangkut perkara Polisi, dan tidak pernah terlibat masalah hukum di lingkungan kami. Surat ini adalah pengantar untuk pengurusan SKCK.";
        break;

      case 'Surat Keterangan Kematian':
        contentBody = `Menerangkan bahwa nama tersebut di atas telah MENINGGAL DUNIA. Detail kejadian: "${letter.description}".`;
        break;

      case 'Surat Keterangan Pindah':
        contentBody = `Menerangkan bahwa yang bersangkutan akan PINDAH DOMISILI ke alamat baru. Detail/Alasan kepindahan: "${letter.description}".`;
        break;

      default:
        // Default jika jenis surat lain (Izin Keramaian, dll)
        contentBody = `Keterangan: "${letter.description}".`;
    }

    // --- MULAI MEMBUAT PDF ---
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Set Header Response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${letter.type.replace(/\s/g, '-')}.pdf`);
    doc.pipe(res);

    // 1. KOP SURAT
    doc.font('Helvetica-Bold').fontSize(18).text('RUKUN TETANGGA 01 / RW 05', { align: 'center' });
    doc.font('Helvetica').fontSize(12).text('Kelurahan Digital, Kecamatan Teknologi, Kota Internet', { align: 'center' });
    doc.lineWidth(2).moveTo(50, 95).lineTo(545, 95).stroke();
    doc.moveDown(2);

    // 2. JUDUL SURAT
    doc.font('Helvetica-Bold').fontSize(14).text(contentTitle, { align: 'center', underline: true });
    // Nomor surat dummy (menggunakan ID unik)
    doc.font('Helvetica').fontSize(10).text(`Nomor: ${letter._id.toString().substring(0, 6)}/RT-01/${new Date().getFullYear()}`, { align: 'center' });
    doc.moveDown(2);

    // 3. PEMBUKA
    doc.font('Helvetica').fontSize(12).text('Yang bertanda tangan di bawah ini, Ketua RT 01 RW 05 menerangkan bahwa:', { align: 'justify' });
    doc.moveDown();

    // 4. DATA DIRI WARGA
    const leftX = 70;
    const gapX = 100;
    
    doc.text('Nama', leftX, doc.y); 
    doc.text(`: ${letter.user.name}`, leftX + gapX, doc.y - 12);
    
    doc.text('NIK', leftX, doc.y + 8); 
    doc.text(`: ${letter.user.nik}`, leftX + gapX, doc.y - 12);
    
    doc.text('Alamat', leftX, doc.y + 8); 
    doc.text(`: ${letter.user.address}`, leftX + gapX, doc.y - 12);

    doc.moveDown(2);

    // 5. ISI SURAT (Dinamis dari Switch Case)
    doc.text(contentBody, { align: 'justify', lineGap: 5 });

    // Jika deskripsi belum masuk di body (selain SKU/Kematian/Pindah), tampilkan di bawah
    if (!['Surat Keterangan Usaha (SKU)', 'Surat Keterangan Kematian', 'Surat Keterangan Pindah'].includes(letter.type)) {
        doc.moveDown();
        doc.text(`Keperluan Tambahan: "${letter.description}"`, { align: 'justify' });
    }

    doc.moveDown();
    doc.text('Demikian surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.', { align: 'justify' });

    doc.moveDown(4);

    // 6. TANDA TANGAN
    const tanggal = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    
    doc.text(`Surabaya, ${tanggal}`, 350, doc.y);
    doc.text('Ketua RT 01', 350, doc.y + 5);
    doc.moveDown(4);
    doc.font('Helvetica-Bold').text('( Bpk. Ketua RT )', 350, doc.y, { underline: true });

    // Selesai
    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal membuat file PDF' });
  }
});

module.exports = router;