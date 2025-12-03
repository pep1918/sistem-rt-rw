import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Megaphone, Calendar, User, Clock } from 'lucide-react'; // Tambah Clock icon

const Announcements = () => {
  const [news, setNews] = useState([]);
  // Tambahkan field 'eventDate' di state form
  const [form, setForm] = useState({ title: '', content: '', eventDate: '' });
  
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/announcements', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setNews(res.data);
      } catch (error) { console.error(error); }
    };
    fetchNews();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/announcements', form, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      alert('Pengumuman berhasil diposting!');
      window.location.reload();
    } catch (error) { alert('Gagal memposting'); }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>Portal Berita & Pengumuman</h2>
      </div>

      {/* Form Input (RT Only) */}
      {user.role === 'rt' && (
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Megaphone size={20} color="var(--primary)"/> Buat Pengumuman Baru
          </h3>
          <form onSubmit={handlePost}>
            
            {/* Input Judul */}
            <div className="input-group">
              <label>Judul Pengumuman</label>
              <input 
                placeholder="Contoh: Kerja Bakti Minggu Ini" 
                onChange={e => setForm({...form, title: e.target.value})} 
                required 
              />
            </div>

            {/* Input Tanggal Acara (FITUR BARU) */}
            <div className="input-group">
              <label>Tanggal Acara / Kegiatan (Opsional)</label>
              <input 
                type="date" 
                onChange={e => setForm({...form, eventDate: e.target.value})} 
                style={{ width: '100%', maxWidth: '300px' }}
              />
            </div>

            {/* Input Isi */}
            <div className="input-group">
              <label>Isi Berita</label>
              <textarea 
                placeholder="Tulis detail pengumuman di sini..." 
                rows="4" 
                onChange={e => setForm({...form, content: e.target.value})} 
                required
              ></textarea>
            </div>
            <button className="btn btn-primary">Broadcast Sekarang</button>
          </form>
        </div>
      )}

      {/* Daftar Berita */}
      <div className="grid-3">
        {news.map(n => (
          <div key={n._id} className="card" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
             
             {/* Label Tanggal Posting */}
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '5px 12px', background: '#f1f5f9', borderBottomLeftRadius: '12px', fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>
              Dibuat: {new Date(n.createdAt).toLocaleDateString('id-ID')}
            </div>

            <div style={{ marginTop: '15px', flex: 1 }}>
              <h3 style={{ marginBottom: '10px', fontSize: '1.1rem', color: 'var(--primary-dark)' }}>{n.title}</h3>
              
              {/* TAMPILKAN TANGGAL ACARA JIKA ADA */}
              {n.eventDate && (
                <div style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '6px', 
                  background: '#eff6ff', color: '#2563eb', padding: '6px 12px', 
                  borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '12px' 
                }}>
                  <Calendar size={14} /> 
                  Acara: {new Date(n.eventDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}

              <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px', whiteSpace: 'pre-line' }}>
                {n.content}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <User size={14} />
              <span>Diposting oleh: <strong>{n.author || 'Pengurus RT'}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;