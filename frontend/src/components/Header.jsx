import React from 'react';
import { User, Bell } from 'lucide-react';

const Header = ({ user }) => {
  // Ambil jam sekarang untuk sapaan
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat Pagi' : hour < 18 ? 'Selamat Siang' : 'Selamat Malam';

  return (
    <header className="header">
      {/* Kiri: Informasi Halaman */}
      <div className="header-title">
        <h2>{greeting}, {user?.name.split(' ')[0]}! 👋</h2>
        <p>Selamat datang di panel administrasi digital.</p>
      </div>

      {/* Kanan: User Profile */}
      <div className="user-profile">
        {/* Contoh Notifikasi (Dummy) */}
        <div style={{ position: 'relative', marginRight: '10px', cursor: 'pointer' }}>
          <Bell size={20} color="#64748b" />
          <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'red', borderRadius: '50%' }}></span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user?.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>
            {user?.role === 'rt' ? 'Ketua RT 01' : 'Warga RT 01'}
          </div>
        </div>
        
        <div className="avatar-circle">
          <User size={20} />
        </div>
      </div>
    </header>
  );
};

export default Header;