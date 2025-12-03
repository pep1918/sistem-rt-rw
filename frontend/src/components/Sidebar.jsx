import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, AlertTriangle, LogOut, Building } from 'lucide-react';

const Sidebar = ({ user, onLogout }) => {
  return (
    <aside className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <Building size={24} style={{ marginRight: '10px', color: '#818cf8' }} />
        <span>SISTEM RT/RW</span>
      </div>

      {/* Menu List */}
      <div className="sidebar-menu">
        <small style={{ paddingLeft: '16px', color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 'bold' }}>Menu Utama</small>
        
        <NavLink to="/" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        {user?.role === 'warga' && (
          <NavLink to="/request" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <FileText size={20} />
            <span>Ajukan Surat</span>
          </NavLink>
        )}

        <NavLink to="/complaints" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
          <AlertTriangle size={20} />
          <span>Lapor Masalah</span>
        </NavLink>
      </div>

      {/* Footer Sidebar (Logout) */}
      <div style={{ padding: '20px', borderTop: '1px solid #334155' }}>
        <button 
          onClick={onLogout} 
          className="menu-item" 
          style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}
        >
          <LogOut size={20} />
          <span>Keluar Aplikasi</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;