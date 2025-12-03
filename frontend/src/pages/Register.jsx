import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', nik: '', address: '', role: 'warga' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Tampilkan loading
    try {
      // Pastikan URL backend benar
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Berhasil! Silakan Login');
      navigate('/login');
    } catch (error) {
      console.error(error);
      // MENAMPILKAN PESAN ERROR ASLI DARI SERVER
      const message = error.response?.data?.message || 'Gagal menghubungi server (Cek Terminal Backend)';
      alert(`Gagal Daftar: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display:'flex', justifyContent:'center', marginTop:'30px'}}>
      <div className="card" style={{width:'500px'}}>
        <h2 style={{textAlign:'center', marginBottom:'20px'}}>Pendaftaran Warga</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group"><label>Nama</label><input name="name" onChange={handleChange} required /></div>
          <div className="input-group"><label>NIK</label><input name="nik" onChange={handleChange} required /></div>
          <div className="input-group"><label>Email</label><input type="email" name="email" onChange={handleChange} required /></div>
          <div className="input-group"><label>Password</label><input type="password" name="password" onChange={handleChange} required /></div>
          <div className="input-group"><label>Alamat</label><textarea name="address" onChange={handleChange} required /></div>
          <div className="input-group">
            <label>Daftar Sebagai (Demo Only)</label>
            <select name="role" onChange={handleChange}>
              <option value="warga">Warga</option>
              <option value="rt">Ketua RT</option>
            </select>
          </div>
          <button className="btn btn-primary" style={{width:'100%'}} disabled={loading}>
            {loading ? 'Sedang Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>
        <p style={{textAlign:'center', marginTop:'15px', fontSize:'0.9rem'}}>Sudah punya akun? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;