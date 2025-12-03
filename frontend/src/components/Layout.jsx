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
    <div className="app-layout">
      {/* Panel 1: Sidebar Kiri */}
      <Sidebar user={user} onLogout={handleLogout} />

      <div className="main-wrapper">
        {/* Panel 2: Header Atas */}
        <Header user={user} />

        {/* Panel 3: Konten Utama (Scrollable) */}
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;