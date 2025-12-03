import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, FileText, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [stats, setStats] = useState({ wargaCount: 0, pendingLetters: 0, approvedLetters: 0 });
  const [letters, setLetters] = useState([]);
  const token = localStorage.getItem('token');

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const letterRes = await axios.get('http://localhost:5000/api/letters', config);
      setLetters(letterRes.data);
      if (user.role === 'rt') {
        const statsRes = await axios.get('http://localhost:5000/api/dashboard/stats', config);
        setStats(statsRes.data);
      }
    } catch (error) { console.error(error); }
  };

  const handleValidation = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/letters/${id}`, { status }, config);
      fetchData();
    } catch (error) { alert('Gagal update'); }
  };

  const getStatusBadge = (status) => {
    if (status === 'pending') return <span className="status-badge bg-yellow">Menunggu</span>;
    if (status === 'approved_rt') return <span className="status-badge bg-green">Disetujui</span>;
    return <span className="status-badge bg-red">Ditolak</span>;
  };

  return (
    <div>
      <h2 style={{marginBottom:'20px'}}>Dashboard Overview</h2>
      
      {/* STATISTIK (HANYA RT) */}
      {user.role === 'rt' && (
        <div className="grid-3">
          <div className="stat-card">
            <Users size={32} color="#4f46e5" />
            <div><div className="stat-val">{stats.wargaCount}</div><div style={{fontSize:'0.9rem', color:'#64748b'}}>Total Warga</div></div>
          </div>
          <div className="stat-card">
            <FileText size={32} color="#f59e0b" />
            <div><div className="stat-val">{stats.pendingLetters}</div><div style={{fontSize:'0.9rem', color:'#64748b'}}>Perlu Validasi</div></div>
          </div>
          <div className="stat-card">
            <CheckCircle size={32} color="#10b981" />
            <div><div className="stat-val">{stats.approvedLetters}</div><div style={{fontSize:'0.9rem', color:'#64748b'}}>Selesai</div></div>
          </div>
        </div>
      )}

      {/* TABEL */}
      <div className="card">
        <h3>{user.role === 'warga' ? 'Surat Saya' : 'Daftar Pengajuan Masuk'}</h3>
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              {user.role === 'rt' && <th>Nama Warga</th>}
              <th>Jenis Surat</th>
              <th>Status</th>
              {user.role === 'rt' && <th>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {letters.map((l) => (
              <tr key={l._id}>
                <td>{new Date(l.createdAt).toLocaleDateString()}</td>
                {user.role === 'rt' && <td><strong>{l.user?.name}</strong><br/><small>{l.user?.nik}</small></td>}
                <td>{l.type}<br/><small style={{color:'#888'}}>{l.description}</small></td>
                <td>{getStatusBadge(l.status)}</td>
                {user.role === 'rt' && (
                  <td>
                    {l.status === 'pending' && (
                      <div style={{display:'flex', gap:'5px'}}>
                        <button onClick={() => handleValidation(l._id, 'approved_rt')} className="btn btn-success" style={{padding:'5px 10px', fontSize:'0.8rem'}}>✓</button>
                        <button onClick={() => handleValidation(l._id, 'rejected')} className="btn btn-danger" style={{padding:'5px 10px', fontSize:'0.8rem'}}>✕</button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {letters.length === 0 && <p style={{padding:'20px', textAlign:'center', color:'#888'}}>Belum ada data.</p>}
      </div>
    </div>
  );
};

export default Dashboard;