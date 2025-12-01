const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'warga'], default: 'warga' }, // Admin = RT/RW
  wargaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warga' } // Relasi ke data warga
});
module.exports = mongoose.model('User', UserSchema);