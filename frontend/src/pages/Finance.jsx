import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, CheckCircle, Clock, Upload } from 'lucide-react';

const Finance = () => {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ type: 'Kebersihan', amount: 50000, month: '', proofDescription: '' });
  const [totalKas, setTotalKas] = useState(0);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/finance', config);
      setPayments(res.data);
      // Hitung Total Kas (Hanya yang Verified)
      const total = res.data
        .filter(p => p.status === 'verified')
        .reduce((acc, curr) => acc + curr.amount, 0);
      setTotalKas(total);
    } catch (error) { console.error(error); }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/finance', form, config);
      alert('Bukti pembayaran dikirim! Menunggu verifikasi RT.');
      fetchPayments();
      setForm({ type: 'Kebersihan', amount: 50000, month: '', proofDescription: '' }); // Reset form
    } catch (error) { alert('Gagal mengirim data'); }
  };

  const handleVerify = async (id) => {
    if(!confirm('Verifikasi pembayaran ini valid?')) return;
    try {
      await axios.put(`http://localhost:5000/api/finance/${id}`, {}, config);
      fetchPayments();
    } catch (error) { alert('Gagal verifikasi'); }
  };

  return (
    <div>
      <h2 style={{fontSize:'1.5rem', fontWeight:'700', marginBottom:'24px'}}>Keuangan & Iuran Warga</h2>

      <div className="grid-3" style={{marginBottom:'30px'}}>
        {/* Kartu Total Kas */}
        <div className="card" style={{background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)', color:'white', border:'none', display:'flex', flexDirection:'column', justifyContent:'center'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px', opacity:0.9}}>
            <DollarSign size={20}/> <span>Total Kas RT (Aktif)</span>
          </div>
          <h1 style={{fontSize:'2.5rem', margin:'15px 0', fontWeight:'800'}}>Rp {totalKas.toLocaleString('id-ID')}</h1>
          <div style={{fontSize:'0.8rem', opacity:0.8}}>Update Realtime</div>
        </div>
        
        {/* Form Bayar (Hanya Warga) */}
        {user.role === 'warga' && (
          <div className="card" style={{gridColumn: 'span 2'}}>
            <h3 style={{marginBottom:'15px', display:'flex', alignItems:'center', gap:'10px'}}>
              <Upload size={20} color="var(--primary)"/> Form Pembayaran Iuran
            </h3>
            <form onSubmit={handlePay}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                <div className="input-group">
                  <label>Jenis Iuran</label>
                  <select onChange={(e)=>setForm({...form, type:e.target.value})}>
                    <option>Kebersihan</option><option>Keamanan</option><option>Sumbangan</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Nominal (Rp)</label>
                  <input type="number" value={form.amount} onChange={(e)=>setForm({...form, amount:Number(e.target.value)})} />
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                 <div className="input-group">
                    <label>Untuk Bulan</label>
                    <input type="text" placeholder="Contoh: Maret 2025" onChange={(e)=>setForm({...form, month:e.target.value})} required/>
                 </div>
                 <div className="input-group">
                    <label>Keterangan Transfer</label>
                    <input type="text" placeholder="Contoh: BCA a.n Budi Santoso" onChange={(e)=>setForm({...form, proofDescription:e.target.value})} required/>
                 </div>
              </div>
              <button className="btn btn-primary" style={{marginTop:'10px'}}>Kirim Bukti Pembayaran</button>
            </form>
          </div>
        )}
      </div>

      {/* Tabel Riwayat */}
      <div className="card">
        <h3>Riwayat Transaksi</h3>
        <div style={{overflowX:'auto'}}>
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                {user.role === 'rt' && <th>Nama Warga</th>}
                <th>Jenis</th>
                <th>Nominal</th>
                <th>Bulan</th>
                <th>Keterangan</th>
                <th>Status</th>
                {user.role === 'rt' && <th>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p._id}>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  {user.role === 'rt' && <td style={{fontWeight:'600'}}>{p.user?.name}</td>}
                  <td>{p.type}</td>
                  <td style={{fontWeight:'bold', color:'var(--primary-dark)'}}>Rp {p.amount.toLocaleString('id-ID')}</td>
                  <td>{p.month}</td>
                  <td style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>{p.proofDescription}</td>
                  <td>
                    <span className={`status-badge ${p.status === 'verified' ? 'bg-green' : 'bg-yellow'}`}>
                      {p.status === 'verified' ? 'Terverifikasi' : 'Menunggu'}
                    </span>
                  </td>
                  {user.role === 'rt' && (
                    <td>
                        {p.status === 'pending' ? (
                            <button onClick={()=>handleVerify(p._id)} className="btn btn-success" style={{padding:'6px 10px', fontSize:'0.75rem'}}>
                                <CheckCircle size={14}/> Verifikasi
                            </button>
                        ) : (
                            <span style={{color:'var(--primary)', fontSize:'0.8rem'}}>Selesai</span>
                        )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && <p style={{textAlign:'center', padding:'20px', color:'var(--text-muted)'}}>Belum ada data transaksi.</p>}
        </div>
      </div>
    </div>
  );
};

export default Finance;