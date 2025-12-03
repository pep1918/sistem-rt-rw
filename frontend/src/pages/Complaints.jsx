// frontend/src/pages/Complaints.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', location: '', priority: 'medium' });
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/complaints', config);
      setComplaints(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/complaints', form, config);
      alert('Aduan berhasil dikirim!');
      setForm({ title: '', description: '', location: '', priority: 'medium' });
      fetchComplaints();
    } catch (error) {
      alert('Gagal mengirim aduan');
    }
  };

  const handleUpdate = async (id, status, responseText) => {
    const response = prompt("Berikan tanggapan untuk warga (Opsional):", responseText || "");
    if (response === null) return;
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}`, { status, response }, config);
      fetchComplaints();
    } catch (error) {
      alert('Gagal update status');
    }
  };

  const getPriorityColor = (p) => {
    if (p === 'high') return '#ef4444'; // Merah
    if (p === 'medium') return '#f97316'; // Orange
    return '#22c55e'; // Hijau
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Layanan Pengaduan Warga</h2>

      {/* FORM INPUT (Hanya untuk Warga) */}
      {user.role === 'warga' && (
        <div className="card">
          <h3>Buat Laporan Baru</h3>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Judul Masalah</label>
              <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Contoh: Lampu Jalan Mati" required />
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
              <div className="input-group">
                <label>Lokasi</label>
                <input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} placeholder="Depan pos kamling" required />
              </div>
              <div className="input-group">
                <label>Prioritas</label>
                <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})}>
                  <option value="low">Rendah (Low)</option>
                  <option value="medium">Sedang (Medium)</option>
                  <option value="high">Darurat (High)</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>Deskripsi Detail</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows="3" required />
            </div>
            <button className="btn btn-danger" style={{ width: '100%' }}>Kirim Laporan</button>
          </form>
        </div>
      )}

      {/* LIST ADUAN */}
      <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {complaints.map((c) => (
          <div key={c._id} className="card" style={{ borderLeft: `5px solid ${getPriorityColor(c.priority)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <h4 style={{ margin: 0 }}>{c.title}</h4>
              <span className={`status-badge ${c.status === 'resolved' ? 'bg-green' : 'bg-yellow'}`}>{c.status}</span>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: '#666', margin: '10px 0' }}>{c.description}</p>
            
            <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span><MapPin size={12}/> {c.location}</span>
              <span><Clock size={12}/> {new Date(c.createdAt).toLocaleDateString()}</span>
            </div>

            {/* AREA KHUSUS RT (Update Status) */}
            {user.role === 'rt' && (
              <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                <p style={{fontSize:'0.8rem'}}>Pelapor: <strong>{c.user?.name}</strong></p>
                {c.status !== 'resolved' && (
                  <div style={{display:'flex', gap:'5px', marginTop:'5px'}}>
                    <button onClick={() => handleUpdate(c._id, 'in_progress', c.response)} className="btn btn-primary" style={{padding:'5px 10px', fontSize:'0.7rem'}}>Proses</button>
                    <button onClick={() => handleUpdate(c._id, 'resolved', c.response)} className="btn btn-success" style={{padding:'5px 10px', fontSize:'0.7rem'}}>Selesai</button>
                  </div>
                )}
              </div>
            )}

            {/* TAMPILKAN RESPON RT */}
            {c.response && (
              <div style={{ background: '#f8fafc', padding: '10px', marginTop: '10px', borderRadius: '5px', fontSize: '0.85rem', border: '1px solid #eee' }}>
                <strong>Tanggapan RT:</strong> <br/> {c.response}
              </div>
            )}
          </div>
        ))}
      </div>
       {complaints.length === 0 && <p style={{textAlign:'center', color:'#888'}}>Belum ada laporan.</p>}
    </div>
  );
};

export default Complaints;