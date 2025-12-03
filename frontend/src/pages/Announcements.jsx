import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Megaphone, Calendar, User } from 'lucide-react';

const Announcements = () => {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  // Ambil data saat halaman dibuka
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/announcements', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setNews(res.data);
      } catch (error) {
        console.error("Gagal mengambil berita", error);
      }
    };
    fetchNews();
  }, []);

  // Fungsi Posting (Khusus RT)
  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/announcements', form, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      alert('Pengumuman berhasil diposting!');
      window.location.reload();
    } catch (error) {
      alert('Gagal memposting pengumuman');
    }
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
        <h2 style={{fontSize:'1.5rem', fontWeight:'700', color:'var(--text-main)'}}>Portal Berita & Pengumuman</h2>
      </div>

      {/* Form Input (Hanya RT) */}
      {user.role === 'rt' && (
        <div className="card" style={{borderLeft:'4px solid var(--primary)'}}>
          <h3 style={{marginBottom:'15px', display:'flex', alignItems:'center', gap:'10px'}}>
            <Megaphone size={20} color="var(--primary)"/> Buat Pengumuman Baru
          </h3>
          <form onSubmit={handlePost}>
            <div className="input-group">
              <label>Judul Pengumuman</label>
              <input 
                placeholder="Contoh: Kerja Bakti Minggu Ini" 
                onChange={e => setForm({...form, title: e.target.value})} 
                required 
              />
            </div>
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
          <div key={n._id} className="card" style={{position:'relative', overflow:'hidden'}}>
             {/* Hiasan background */}
            <div style={{position:'absolute', top:0, right:0, padding:'5px 10px', background:'var(--bg-body)', borderBottomLeftRadius:'10px', fontSize:'0.7rem', color:'var(--text-muted)'}}>
              <Calendar size={12} style={{marginRight:'5px', verticalAlign:'middle'}}/>
              {new Date(n.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>

            <div style={{marginTop:'10px'}}>
              <h3 style={{marginBottom:'10px', fontSize:'1.1rem', color:'var(--primary-dark)'}}>{n.title}</h3>
              <p style={{color:'var(--text-main)', fontSize:'0.9rem', lineHeight:'1.6', marginBottom:'20px'}}>
                {n.content}
              </p>
            </div>

            <div style={{borderTop:'1px solid #f1f5f9', paddingTop:'15px', display:'flex', alignItems:'center', gap:'8px', fontSize:'0.8rem', color:'var(--text-muted)'}}>
              <User size={14} />
              <span>Diposting oleh: <strong>{n.author || 'Pengurus RT'}</strong></span>
            </div>
          </div>
        ))}
      </div>
      
      {news.length === 0 && (
        <div style={{textAlign:'center', padding:'40px', color:'var(--text-muted)'}}>
          <Megaphone size={40} style={{opacity:0.3, marginBottom:'10px'}}/>
          <p>Belum ada pengumuman terbaru.</p>
        </div>
      )}
    </div>
  );
};

export default Announcements;