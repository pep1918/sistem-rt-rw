import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Kita pakai useNavigate untuk pindah halaman
import { Hexagon, UserPlus, MapPin, CreditCard, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', nik: '', address: '', role: 'warga' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. FITUR AUTO CLEAR: Kosongkan form saat halaman dibuka
  useEffect(() => {
    setFormData({ name: '', email: '', password: '', nik: '', address: '', role: 'warga' });
  }, []);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Berhasil! Silakan Login');
      navigate('/login');
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Gagal menghubungi server';
      alert(`Gagal Daftar: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    // WRAPPER UTAMA: Menggunakan Position Fixed agar menimpa style Dashboard yang bikin error
    <div style={{
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      overflowY: 'auto', // INI AGAR BISA SCROLL
      backgroundColor: '#f1f5f9', // Warna Background Abu
      zIndex: 9999, // Pastikan di paling atas
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '50px',
      paddingBottom: '50px'
    }}>
      
      <div className="card" style={{
        width: '90%',
        maxWidth: '500px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        padding: '30px',
        height: 'fit-content' // Agar tinggi menyesuaikan isi
      }}>
        
        {/* HEADER */}
        <div style={{textAlign:'center', marginBottom:'30px'}}>
            <div style={{
                width:'50px', height:'50px', background:'#4f46e5', borderRadius:'12px', 
                display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 15px auto'
            }}>
                <Hexagon size={28} color="white" />
            </div>
            <h2 style={{fontSize:'1.5rem', fontWeight:'bold', color:'#1e293b'}}>Pendaftaran Warga</h2>
            <p style={{color:'#64748b'}}>Isi data diri Anda dengan lengkap</p>
        </div>

        <form onSubmit={handleRegister} autoComplete="off">
          
          <div className="input-group" style={{marginBottom:'15px'}}>
            <label style={{fontWeight:'600', display:'block', marginBottom:'5px'}}>Nama Lengkap</label>
            <div style={{display:'flex', alignItems:'center', border:'1px solid #ccc', borderRadius:'8px', padding:'0 10px', background:'#f8fafc'}}>
                <User size={18} color="#64748b"/>
                <input name="name" onChange={handleChange} required placeholder="Sesuai KTP" style={{border:'none', width:'100%', padding:'10px', background:'transparent', outline:'none'}} />
            </div>
          </div>

          <div className="input-group" style={{marginBottom:'15px'}}>
            <label style={{fontWeight:'600', display:'block', marginBottom:'5px'}}>NIK</label>
            <div style={{display:'flex', alignItems:'center', border:'1px solid #ccc', borderRadius:'8px', padding:'0 10px', background:'#f8fafc'}}>
                <CreditCard size={18} color="#64748b"/>
                <input name="nik" onChange={handleChange} required placeholder="16 Digit NIK" style={{border:'none', width:'100%', padding:'10px', background:'transparent', outline:'none'}} />
            </div>
          </div>

          <div className="input-group" style={{marginBottom:'15px'}}>
            <label style={{fontWeight:'600', display:'block', marginBottom:'5px'}}>Email</label>
            <div style={{display:'flex', alignItems:'center', border:'1px solid #ccc', borderRadius:'8px', padding:'0 10px', background:'#f8fafc'}}>
                <Mail size={18} color="#64748b"/>
                <input type="email" name="email" onChange={handleChange} required placeholder="email@contoh.com" autoComplete="off" style={{border:'none', width:'100%', padding:'10px', background:'transparent', outline:'none'}} />
            </div>
          </div>

          <div className="input-group" style={{marginBottom:'15px'}}>
            <label style={{fontWeight:'600', display:'block', marginBottom:'5px'}}>Password</label>
            <div style={{display:'flex', alignItems:'center', border:'1px solid #ccc', borderRadius:'8px', padding:'0 10px', background:'#f8fafc'}}>
                <Lock size={18} color="#64748b"/>
                <input type="password" name="password" onChange={handleChange} required placeholder="******" autoComplete="new-password" style={{border:'none', width:'100%', padding:'10px', background:'transparent', outline:'none'}} />
            </div>
          </div>

          <div className="input-group" style={{marginBottom:'15px'}}>
            <label style={{fontWeight:'600', display:'block', marginBottom:'5px'}}>Alamat</label>
            <div style={{display:'flex', alignItems:'start', border:'1px solid #ccc', borderRadius:'8px', padding:'10px', background:'#f8fafc'}}>
                <MapPin size={18} color="#64748b" style={{marginTop:'3px'}}/>
                <textarea name="address" onChange={handleChange} required placeholder="Alamat Lengkap..." rows="2" style={{border:'none', width:'100%', paddingLeft:'10px', background:'transparent', outline:'none', resize:'none'}} />
            </div>
          </div>

          <div className="input-group" style={{marginBottom:'20px'}}>
            <label style={{fontWeight:'600', display:'block', marginBottom:'5px'}}>Daftar Sebagai</label>
            <select name="role" onChange={handleChange} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}}>
              <option value="warga">Warga</option>
              <option value="rt">Ketua RT</option>
              <option value="rw">Ketua RW</option>
            </select>
          </div>

          <button 
            className="btn btn-primary" 
            style={{
                width:'100%', padding:'12px', background:'#4f46e5', color:'white', 
                border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer', fontSize:'1rem'
            }} 
            disabled={loading}
          >
            {loading ? 'Sedang Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        {/* LINK LOGIN: Menggunakan BUTTON agar pasti bisa diklik */}
        <div style={{textAlign:'center', marginTop:'20px'}}>
            <span style={{color:'#64748b', fontSize:'0.9rem'}}>Sudah punya akun? </span>
            <button 
                onClick={() => navigate('/login')}
                style={{
                    background:'none', border:'none', color:'#4f46e5', 
                    fontWeight:'bold', cursor:'pointer', fontSize:'0.9rem', textDecoration:'underline'
                }}
            >
                Login 
            </button>
        </div>

      </div>
    </div>
  );
};

export default Register;