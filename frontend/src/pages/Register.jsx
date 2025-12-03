import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Hexagon, UserPlus, MapPin, CreditCard, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    nik: '', 
    address: '', 
    role: 'warga' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Registrasi Berhasil! Silakan Login.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal mendaftar.';
      alert(`Gagal: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    // WRAPPER UTAMA (Perbaikan Scroll)
    <div style={{
      position: 'fixed',      // Menimpa setting body dashboard
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',         // Full layar
      overflowY: 'auto',      // WAJIB: Mengaktifkan scroll vertikal
      background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)',
      zIndex: 9999,           // Pastikan di atas layer lain
      display: 'flex',        // Gunakan flexbox
      alignItems: 'flex-start', // Mulai dari atas (penting agar scroll jalan di HP)
      justifyContent: 'center'
    }}>
      
      {/* KARTU TENGAH */}
      <div className="card" style={{
        width: '100%',
        maxWidth: '500px',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        border: '1px solid rgba(255,255,255,0.8)',
        // Trik margin auto pada Flexbox akan membuatnya center vertikal & horizontal
        // tapi tetap aman saat di-scroll
        margin: 'auto',       
        marginTop: '40px',    // Jarak aman atas
        marginBottom: '40px'  // Jarak aman bawah
      }}>
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px', height: '60px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 15px auto',
            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
          }}>
            <Hexagon size={32} color="white" fill="white" fillOpacity={0.2} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e293b', marginBottom: '5px' }}>
            Daftar Akun Baru
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Lengkapi data diri untuk akses layanan
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleRegister}>
          
          <div className="input-group">
            <label style={{display:'flex', alignItems:'center', gap:'8px', fontWeight:'600'}}>
              <User size={16} color="var(--primary)"/> Nama Lengkap
            </label>
            <input name="name" onChange={handleChange} required placeholder="Sesuai KTP" style={{background:'#f8fafc', padding:'12px'}} />
          </div>
          
          <div className="input-group">
            <label style={{display:'flex', alignItems:'center', gap:'8px', fontWeight:'600'}}>
              <CreditCard size={16} color="var(--primary)"/> NIK
            </label>
            <input name="nik" onChange={handleChange} required placeholder="16 Digit NIK" type="number" style={{background:'#f8fafc', padding:'12px'}} />
          </div>

          <div className="input-group">
            <label style={{display:'flex', alignItems:'center', gap:'8px', fontWeight:'600'}}>
              <Mail size={16} color="var(--primary)"/> Email Aktif
            </label>
            <input type="email" name="email" onChange={handleChange} required placeholder="email@contoh.com" style={{background:'#f8fafc', padding:'12px'}} />
          </div>

          <div className="input-group">
            <label style={{display:'flex', alignItems:'center', gap:'8px', fontWeight:'600'}}>
              <Lock size={16} color="var(--primary)"/> Password
            </label>
            <input type="password" name="password" onChange={handleChange} required placeholder="Minimal 6 karakter" style={{background:'#f8fafc', padding:'12px'}} />
          </div>

          <div className="input-group">
            <label style={{display:'flex', alignItems:'center', gap:'8px', fontWeight:'600'}}>
              <MapPin size={16} color="var(--primary)"/> Alamat Lengkap
            </label>
            <textarea 
              name="address" 
              onChange={handleChange} 
              required 
              placeholder="Nama Jalan, No. Rumah, RT/RW..." 
              rows="3" 
              style={{background:'#f8fafc', padding:'12px', resize:'none'}} 
            />
          </div>

          <div className="input-group">
            <label style={{fontWeight:'600'}}>Daftar Sebagai</label>
            <select 
              name="role" 
              onChange={handleChange}
              style={{ padding: '12px', background: '#fff', border: '2px solid #e2e8f0', cursor:'pointer', width: '100%', borderRadius: '8px' }}
            >
              <option value="warga">Warga</option>
              <option value="rt">Ketua RT</option>
              <option value="rw">Ketua RW</option> 
            </select>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '20px', padding: '14px', borderRadius:'12px', fontSize:'1rem', justifyContent:'center' }}
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Daftar Sekarang'} <UserPlus size={18} style={{ marginLeft: '8px' }}/>
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem', color: '#64748b' }}>
          Sudah punya akun? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Masuk disini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;