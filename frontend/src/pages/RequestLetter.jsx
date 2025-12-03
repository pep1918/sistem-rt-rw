import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileText, Send } from 'lucide-react';

const RequestLetter = () => {
  const [type, setType] = useState('Surat Pengantar KTP/KK');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      await axios.post('http://localhost:5000/api/letters', 
        { type, description: desc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Surat berhasil diajukan! Pantau statusnya di Dashboard.');
      navigate('/');
    } catch (error) {
      alert('Gagal mengajukan surat. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk memberi saran isi keterangan
  const getPlaceholder = () => {
    if (type.includes('Usaha')) return "Contoh: Jualan Nasi Goreng di depan rumah, modal mandiri.";
    if (type.includes('Kematian')) return "Contoh: Meninggal dunia pada hari Senin, 12 Maret 2025 di RSUD.";
    if (type.includes('Pindah')) return "Contoh: Pindah ke Jl. Merpati No 5, Jakarta Selatan (Ikut Suami).";
    return "Jelaskan keperluan detail Anda di sini...";
  };

  return (
    <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FileText size={24} color="var(--primary)" /> Form Pengajuan Surat
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Jenis Surat</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            style={{ padding: '12px', fontSize: '1rem' }}
          >
            <option value="Surat Pengantar KTP/KK">Surat Pengantar KTP / KK</option>
            <option value="Surat Keterangan Domisili">Surat Keterangan Domisili</option>
            <option value="Surat Keterangan Tidak Mampu (SKTM)">Surat Keterangan Tidak Mampu (SKTM)</option>
            <option value="Surat Keterangan Usaha (SKU)">Surat Keterangan Usaha (SKU)</option>
            <option value="Surat Pengantar SKCK">Surat Pengantar SKCK (Kepolisian)</option>
            <option value="Surat Keterangan Kematian">Surat Keterangan Kematian</option>
            <option value="Surat Keterangan Pindah">Surat Keterangan Pindah Domisili</option>
            <option value="Surat Izin Keramaian">Surat Izin Keramaian / Hajatan</option>
          </select>
        </div>

        <div className="input-group">
          <label>Keterangan Tambahan / Detail Keperluan</label>
          <textarea 
            rows="4" 
            value={desc} 
            onChange={(e) => setDesc(e.target.value)} 
            placeholder={getPlaceholder()}
            required
            style={{ fontFamily: 'inherit' }}
          ></textarea>
          <small style={{ color: '#64748b' }}>*Isi detail yang relevan agar memudahkan Pak RT memverifikasi.</small>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '10px' }}
          disabled={loading}
        >
          {loading ? 'Mengirim...' : 'Kirim Pengajuan'} <Send size={20} style={{ marginLeft: '5px' }} />
        </button>
      </form>
    </div>
  );
};

export default RequestLetter;