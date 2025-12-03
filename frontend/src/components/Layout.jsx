import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    if (confirm('Yakin ingin keluar?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    // Class 'app-layout' ini yang mengaktifkan Flexbox (Kiri & Kanan)
    <div className="app-layout">
      
      {/* Panel Kiri */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Panel Kanan (Header + Isi) */}
      <div className="main-wrapper">
        <Header user={user} />
        
        {/* Konten Utama yang bisa di-scroll */}
        <main className="content-area">
          {children}
        </main>
      </div>

    </div>
  );
};

export default Layout;