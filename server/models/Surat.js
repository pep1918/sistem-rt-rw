const mongoose = require('mongoose');

const SuratSchema = new mongoose.Schema({
  pemohon: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jenisSurat: { type: String, required: true }, // Misal: Pengantar KTP, Domisili
  keterangan: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'disetujui', 'ditolak'], 
    default: 'pending' 
  },
  tanggalPengajuan: { type: Date, default: Date.now },
  tanggalValidasi: { type: Date }
});

module.exports = mongoose.model('Surat', SuratSchema);