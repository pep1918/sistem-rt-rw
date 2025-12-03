// frontend/src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, FileText, CheckCircle, Clock, Download } from 'lucide-react'; // Tambah icon Download

const Dashboard = () => {
  // Ambil data user dari LocalStorage
  const [user] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [stats, setStats] = useState({ wargaCount: 0, pendingLetters: 0, approvedLetters: 0 });
  const [letters, setLetters] = useState([]);
  
  // Ambil token untuk otentikasi request
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

      // Jika yang login adalah RT, ambil juga data statistik
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
    if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi ${status}?`)) return;

    try {
      await axios.put(`http://localhost:5000/api/letters/${id}`, { status }, config);
      fetchData(); // Refresh data otomatis setelah update
    } catch (error) {
      alert('Gagal mengupdate status surat.');
    }
  };

  // --- 3. FUNGSI DOWNLOAD PDF (FITUR BARU) ---
  const handleDownload = async (id, fileName) => {
    try {
      // Request ke backend dengan tipe data BLOB (Binary Large Object)
      const response = await axios.get(`http://localhost:5000/api/letters/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', 
      });

      // Membuat URL virtual untuk file tersebut
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Membuat elemen <a> sementara untuk men-trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Surat-${fileName}.pdf`); // Nama file saat didownload
      document.body.appendChild(link);
      link.click();
      
      // Bersihkan elemen link setelah selesai
      link.remove();
    } catch (error) {
      console.error(error);
      alert('Gagal mendownload. Pastikan surat sudah disetujui.');
    }
  };

  // --- HELPER: WARNA BADGE STATUS ---
  const getStatusBadge = (status) => {
    if (status === 'pending') {
      return <span className="status-badge bg-yellow">Menunggu Validasi</span>;
    }
    if (status === 'approved_rt') {
      return <span className="status-badge bg-green">Disetujui RT</span>;
    }
    return <span className="status-badge bg-red">Ditolak</span>;
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px', fontWeight: '600' }}>
        Dashboard {user.role === 'rt' ? 'Pengurus RT' : 'Warga'}
      </h2>
      
      {/* --- BAGIAN STATISTIK (HANYA MUNCUL UNTUK RT) --- */}
      {user.role === 'rt' && (
        <div className="grid-3">
          <div className="stat-card">
            <div style={{ background: '#e0e7ff', padding: '10px', borderRadius: '8px', color: '#4f46e5' }}>
              <Users size={28} />
            </div>
            <div>
              <div className="stat-val">{stats.wargaCount}</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Total Warga</div>
            </div>
          </div>
          <div className="stat-card">
            <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '8px', color: '#d97706' }}>
              <Clock size={28} />
            </div>
            <div>
              <div className="stat-val">{stats.pendingLetters}</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Perlu Validasi</div>
            </div>
          </div>
          <div className="stat-card">
            <div style={{ background: '#d1fae5', padding: '10px', borderRadius: '8px', color: '#059669' }}>
              <CheckCircle size={28} />
            </div>
            <div>
              <div className="stat-val">{stats.approvedLetters}</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Surat Selesai</div>
            </div>
          </div>
        </div>
      )}

      {/* --- BAGIAN TABEL DATA --- */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>{user.role === 'warga' ? 'Riwayat Surat Saya' : 'Daftar Pengajuan Masuk'}</h3>
          
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
                  <td>{new Date(l.createdAt).toLocaleDateString('id-ID')}</td>

                  {/* 2. Nama (RT Only) */}
                  {user.role === 'rt' && (
                    <td>
                      <div style={{ fontWeight: 'bold' }}>{l.user?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>NIK: {l.user?.nik}</div>
                    </td>
                  )}

                  {/* 3. Jenis & Keterangan */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                      <FileText size={16} color="#64748b" />
                      {l.type}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', maxWidth: '250px' }}>
                      {l.description}
                    </div>
                  </td>

                  {/* 4. Status Badge */}
                  <td>{getStatusBadge(l.status)}</td>

                  {/* 5. Kolom Aksi (Tombol-tombol) */}
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      
                      {/* TAMPILKAN TOMBOL DOWNLOAD JIKA STATUS DISETUJUI (Untuk Warga & RT) */}
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
                            fontSize: '0.8rem',
                            display: 'flex', alignItems: 'center', gap: '5px'
                          }}
                        >
                          <Download size={16} /> PDF
                        </button>
                      )}

                      {/* TAMPILKAN TOMBOL TERIMA/TOLAK JIKA STATUS PENDING (Hanya RT) */}
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

          {/* Pesan jika data kosong */}
          {letters.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              <p>Belum ada data surat saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;