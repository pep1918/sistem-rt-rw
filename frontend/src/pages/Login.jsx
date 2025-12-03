import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Hexagon, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/');
    } catch (error) {
      alert('Login Gagal: Email atau Password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid white'
      }}>
        {/* LOGO AREA */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px', height: '60px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px auto',
            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)'
          }}>
            <Hexagon size={32} color="white" fill="white" fillOpacity={0.2} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e293b' }}>Selamat Datang</h2>
          <p style={{ color: '#64748b', marginTop: '5px' }}>Sistem Informasi RT/RW Digital</p>
        </div>

        {/* FORM LOGIN */}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label style={{ fontSize: '0.9rem', color: '#475569' }}>Email Warga / RT</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="nama@email.com"
              required 
              style={{ padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}
            />
          </div>
          <div className="input-group" style={{ marginBottom: '25px' }}>
            <label style={{ fontSize: '0.9rem', color: '#475569' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
              style={{ padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '14px', 
              fontSize: '1rem', 
              borderRadius: '12px',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)'
            }}
          >
            {loading ? 'Memuat...' : 'Login'} <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.9rem', color: '#64748b' }}>
          Belum terdaftar? <Link to="/register" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>Buat Akun </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;