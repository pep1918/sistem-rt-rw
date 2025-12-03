import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, FilePlus, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!token) return null;

  return (
    <nav className="navbar">
      <div style={{display:'flex', alignItems:'center', gap:'10px', color:'#4f46e5', fontWeight:'bold', fontSize:'1.2rem'}}>
        <Home /> Sistem RT/RW
      </div>
      <div style={{display:'flex', alignItems:'center'}}>
        <Link to="/">Dashboard</Link>
        {user?.role === 'warga' && <Link to="/request">Ajukan Surat</Link>}
        
        <div style={{marginLeft:'30px', paddingLeft:'20px', borderLeft:'1px solid #ddd', display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{textAlign:'right', fontSize:'0.85rem'}}>
            <div style={{fontWeight:'bold'}}>{user?.name}</div>
            <div style={{color:'#888', textTransform:'capitalize'}}>{user?.role}</div>
          </div>
          <button onClick={handleLogout} className="btn btn-danger" style={{padding:'8px 12px'}}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;