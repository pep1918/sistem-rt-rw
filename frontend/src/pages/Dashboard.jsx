// frontend/src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, FileText, CheckCircle, Clock, Download, XCircle } from 'lucide-react';

const Dashboard = () => {
  // Ambil data user dari LocalStorage
  const [user] = useState(JSON.parse(localStorage.getItem('user')) || {});
  
  // State untuk data
  const [stats, setStats] = useState({ wargaCount: 0, pendingLetters: 0, approvedLetters: 0 });
  const [letters, setLetters] = useState([]);
  
  // Ambil token
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // --- 1. FETCH DATA SAAT HALAMAN DIBUKA ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Ambil data surat
      const letterRes = await axios.get('http://localhost:5000/api/letters', config);
      setLetters(letterRes.data);

      // Jika RT, ambil juga data statistik
      if (user.role === 'rt') {
        const statsRes = await axios.get('http://localhost:5000/api/dashboard/stats', config);
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  // --- 2. FUNGSI UPDATE STATUS (KHUSUS RT) ---
  const handleValidation = async (id, status) => {
    const action = status === 'approved_rt' ? 'menyetujui' : 'menolak';
    if (!confirm(`Apakah Anda yakin ingin ${action} surat ini?`)) return;

    try {
      await axios.put(`http://localhost:5000/api/letters/${id}`, { status }, config);
      fetchData(); // Refresh data otomatis
    } catch (error) {
      alert('Gagal mengupdate status surat.');
    }
  };

  // --- 3. FUNGSI DOWNLOAD PDF ---
  const handleDownload = async (id, fileName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/letters/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Penting agar dianggap file
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Surat-${fileName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert('Gagal mendownload. Pastikan surat sudah disetujui.');
    }
  };

  // --- HELPER: BADGE STATUS ---
  const getStatusBadge = (status) => {
    if (status === 'pending') {
      return (
        <span className="status-badge bg-yellow" style={{ display: 'flex', alignItems: 'center', gap: '5px', width: 'fit-content' }}>
          <Clock size={12} /> Menunggu
        </span>
      );
    }
    if (status === 'approved_rt') {
      return (
        <span className="status-badge bg-green" style={{ display: 'flex', alignItems: 'center', gap: '5px', width: 'fit-content' }}>
          <CheckCircle size={12} /> Disetujui RT
        </span>
      );
    }
    return (
      <span className="status-badge bg-red" style={{ display: 'flex', alignItems: 'center', gap: '5px', width: 'fit-content' }}>
        <XCircle size={12} /> Ditolak
      </span>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>
          Dashboard {user.role === 'rt' ? 'Pengurus RT' : 'Warga'}
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Pantau aktivitas administrasi lingkungan Anda.</p>
      </div>
      
      {/* --- BAGIAN STATISTIK (HANYA MUNCUL UNTUK RT) --- */}
      {user.role === 'rt' && (
        <div className="grid-3" style={{ marginBottom: '30px' }}>
          
          {/* CARD 1: TOTAL WARGA (Biru) */}
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
            color: 'white', border: 'none', position: 'relative', overflow: 'hidden' 
          }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '5px' }}>Total Warga</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{stats.wargaCount}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
                  <Users size={24} color="white" />
                </div>
              </div>
            </div>
            {/* Dekorasi Background */}
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '100px', height: '100px', background: 'white', opacity: 0.1, borderRadius: '50%' }}></div>
          </div>

          {/* CARD 2: MENUNGGU VALIDASI (Orange) */}
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
            color: 'white', border: 'none', position: 'relative', overflow: 'hidden' 
          }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '5px' }}>Menunggu Validasi</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{stats.pendingLetters}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
                  <Clock size={24} color="white" />
                </div>
              </div>
            </div>
             <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '100px', height: '100px', background: 'white', opacity: 0.1, borderRadius: '50%' }}></div>
          </div>

          {/* CARD 3: SURAT SELESAI (Hijau) */}
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            color: 'white', border: 'none', position: 'relative', overflow: 'hidden' 
          }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '5px' }}>Surat Selesai</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{stats.approvedLetters}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
                  <CheckCircle size={24} color="white" />
                </div>
              </div>
            </div>
             <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '100px', height: '100px', background: 'white', opacity: 0.1, borderRadius: '50%' }}></div>
          </div>
          
        </div>
      )}

      {/* --- BAGIAN TABEL DATA --- */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
            {user.role === 'warga' ? 'Riwayat Surat Saya' : 'Daftar Pengajuan Masuk'}
          </h3>
          
          {/* Tombol Pintas untuk Warga */}
          {user.role === 'warga' && (
             <a href="/request" className="btn btn-primary" style={{ textDecoration: 'none' }}>
               + Buat Pengajuan
             </a>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                {/* Kolom Nama hanya untuk RT */}
                {user.role === 'rt' && <th>Nama Warga</th>}
                <th>Jenis Surat</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {letters.map((l) => (
                <tr key={l._id}>
                  {/* 1. Tanggal */}
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(l.createdAt).toLocaleDateString('id-ID')}
                  </td>

                  {/* 2. Nama (RT Only) */}
                  {user.role === 'rt' && (
                    <td>
                      <div style={{ fontWeight: '600' }}>{l.user?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>NIK: {l.user?.nik}</div>
                    </td>
                  )}

                  {/* 3. Jenis & Keterangan */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: 'var(--text-main)' }}>
                      <FileText size={16} color="var(--primary)" />
                      {l.type}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '300px' }}>
                      {l.description}
                    </div>
                  </td>

                  {/* 4. Status Badge */}
                  <td>{getStatusBadge(l.status)}</td>

                  {/* 5. Kolom Aksi */}
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      
                      {/* DOWNLOAD PDF (Warga & RT) - Muncul jika Approved */}
                      {l.status === 'approved_rt' && (
                        <button 
                          onClick={() => handleDownload(l._id, l.type)} 
                          className="btn"
                          title="Download Surat PDF"
                          style={{ 
                            background: 'white', 
                            border: '1px solid #4f46e5', 
                            color: '#4f46e5',
                            padding: '6px 12px',
                            fontSize: '0.8rem'
                          }}
                        >
                          <Download size={14} /> PDF
                        </button>
                      )}

                      {/* VALIDASI (Hanya RT) - Muncul jika Pending */}
                      {user.role === 'rt' && l.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleValidation(l._id, 'approved_rt')} 
                            className="btn btn-success" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            Terima
                          </button>
                          <button 
                            onClick={() => handleValidation(l._id, 'rejected')} 
                            className="btn btn-danger" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            Tolak
                          </button>
                        </>
                      )}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {letters.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
              <div style={{ background: '#f1f5f9', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
                <FileText size={30} opacity={0.5} />
              </div>
              <p>Belum ada data surat saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;