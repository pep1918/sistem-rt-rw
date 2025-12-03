import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RequestLetter = () => {
  const [type, setType] = useState('Surat Pengantar');
  const [desc, setDesc] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/letters', { type, description: desc }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Berhasil diajukan'); navigate('/');
    } catch (error) { alert('Gagal'); }
  };

  return (
    <div className="card" style={{maxWidth:'600px', margin:'0 auto'}}>
      <h2>Form Pengajuan Surat</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Jenis Surat</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Surat Pengantar</option>
            <option>Surat Keterangan Domisili</option>
            <option>Surat Kematian</option>
          </select>
        </div>
        <div className="input-group">
          <label>Keperluan</label>
          <textarea rows="4" value={desc} onChange={(e) => setDesc(e.target.value)} required placeholder="Jelaskan keperluan Anda..."></textarea>
        </div>
        <button className="btn btn-primary">Kirim</button>
      </form>
    </div>
  );
};

export default RequestLetter;