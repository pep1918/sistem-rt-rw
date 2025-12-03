const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Kebersihan', 'Keamanan', 'Sumbangan'], required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // Contoh: "Maret 2025"
  status: { type: String, enum: ['pending', 'verified'], default: 'pending' },
  proofDescription: { type: String }, // Keterangan transfer (pengganti upload file sederhana)
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);