import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, AlertTriangle, DollarSign, Megaphone, LogOut, Hexagon } from 'lucide-react';

const Sidebar = ({ user, onLogout }) => {
  return (
    <aside className="sidebar">
      {/* Header Sidebar */}
      <div className="sidebar-header">
        <div style={{background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding:'8px', borderRadius:'10px', display:'flex'}}>
            <Hexagon size={24} color="white" fill="white" fillOpacity={0.2} />
        </div>
        <div className="brand-text">SISTEM RT/RW</div>
      </div>

      {/* Menu List */}
      <div className="sidebar-menu">
        <div className="menu-label">Menu Utama</div>
        <NavLink to="/" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          <LayoutDashboard size={20} /> <span>Dashboard</span>
        </NavLink>
        {user?.role === 'warga' && (
          <NavLink to="/request" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <FileText size={20} /> <span>Ajukan Surat</span>
          </NavLink>
        )}
        <NavLink to="/complaints" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          <AlertTriangle size={20} /> <span>Lapor Masalah</span>
        </NavLink>

        <div className="menu-label">Keuangan & Info</div>
        <NavLink to="/finance" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          <DollarSign size={20} /> <span>Keuangan</span>
        </NavLink>
        <NavLink to="/announcements" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          <Megaphone size={20} /> <span>Portal Berita</span>
        </NavLink>
      </div>

      {/* Footer (Tombol Logout) */}
      <div className="sidebar-footer">
        <button onClick={onLogout} className="btn-logout">
          <LogOut size={20} /> <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;