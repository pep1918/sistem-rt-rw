import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, CheckCircle, Upload, History } from 'lucide-react';

const Finance = () => {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ 
    type: 'Kebersihan', 
    amount: 50000, 
    month: '', 
    proofDescription: '' 
  });
  const [totalKas, setTotalKas] = useState(0);
  const [loading, setLoading] = useState(false); // Status loading tombol

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/finance', config);
      setPayments(res.data);
      
      // Hitung Total Kas (Hanya yang status Verified)
      const total = res.data
        .filter(p => p.status === 'verified')
        .reduce((acc, curr) => acc + curr.amount, 0);
      setTotalKas(total);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    }
  };

  // --- FUNGSI KIRIM PEMBAYARAN (YANG DIPERBAIKI) ---
  const handlePay = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    console.log("Mengirim data...", form); // Cek di Console browser

    // 1. Validasi Manual
    if (!form.month || !form.proofDescription) {
      alert("Harap isi Bulan dan Keterangan Transfer!");
      return;
    }

    setLoading(true); // Matikan tombol sementara

    try {
      // 2. Kirim ke Backend
      await axios.post('http://localhost:5000/api/finance', form, config);
      
      alert('Berhasil! Bukti pembayaran telah dikirim ke RT.');
      
      // 3. Reset Form & Refresh Data
      setForm({ type: 'Kebersihan', amount: 50000, month: '', proofDescription: '' });
      fetchPayments();

    } catch (error) {
      console.error(error);
      // Tampilkan pesan error asli dari server jika ada
      const errMsg = error.response?.data?.message || "Gagal mengirim data. Cek koneksi server.";
      alert(errMsg);
    } finally {
      setLoading(false); // Hidupkan tombol lagi
    }
  };

  const handleVerify = async (id) => {
    if(!confirm('Apakah pembayaran ini valid dan uang sudah masuk?')) return;
    try {
      await axios.put(`http://localhost:5000/api/finance/${id}`, {}, config);
      fetchPayments();
    } catch (error) {
      alert('Gagal verifikasi: ' + error.response?.data?.message);
    }
  };

  return (
    <div>
      <h2 style={{fontSize:'1.5rem', fontWeight:'700', marginBottom:'24px', color:'var(--text-main)'}}>Keuangan & Iuran Warga</h2>

      <div className="grid-3" style={{marginBottom:'30px'}}>
        
        {/* KARTU TOTAL KAS */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)', 
          color:'white', border:'none', 
          display:'flex', flexDirection:'column', justifyContent:'center'
        }}>
          <div style={{display:'flex', alignItems:'center', gap:'10px', opacity:0.9}}>
            <DollarSign size={20}/> <span>Total Kas RT (Aktif)</span>
          </div>
          <h1 style={{fontSize:'2.5rem', margin:'15px 0', fontWeight:'800'}}>
            Rp {totalKas.toLocaleString('id-ID')}
          </h1>
          <div style={{fontSize:'0.8rem', opacity:0.8}}>Update Realtime</div>
        </div>
        
        {/* FORM BAYAR (KHUSUS WARGA) */}
        {user.role === 'warga' && (
          <div className="card" style={{gridColumn: 'span 2'}}>
            <h3 style={{marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px', color:'var(--primary)'}}>
              <Upload size={20}/> Form Konfirmasi Pembayaran
            </h3>
            
            <form onSubmit={handlePay}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                
                {/* Jenis Iuran */}
                <div className="input-group">
                  <label>Jenis Iuran</label>
                  <select 
                    value={form.type}
                    onChange={(e)=>setForm({...form, type:e.target.value})}
                  >
                    <option value="Kebersihan">Kebersihan (Sampah)</option>
                    <option value="Keamanan">Keamanan (Satpam)</option>
                    <option value="Sumbangan">Sumbangan Sukarela</option>
                  </select>
                </div>

                {/* Nominal */}
                <div className="input-group">
                  <label>Nominal (Rp)</label>
                  <input 
                    type="number" 
                    value={form.amount} 
                    onChange={(e)=>setForm({...form, amount:Number(e.target.value)})} 
                    required
                  />
                </div>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginTop:'10px'}}>
                 
                 {/* Bulan */}
                 <div className="input-group">
                    <label>Untuk Bulan</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Maret 2025" 
                      value={form.month}
                      onChange={(e)=>setForm({...form, month:e.target.value})} 
                      required
                    />
                 </div>

                 {/* Keterangan */}
                 <div className="input-group">
                    <label>Info Transfer (Bank/Nama)</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: BCA a.n Budi" 
                      value={form.proofDescription}
                      onChange={(e)=>setForm({...form, proofDescription:e.target.value})} 
                      required
                    />
                 </div>
              </div>

              <div style={{marginTop:'20px', textAlign:'right'}}>
                <button 
                  type="submit" // WAJIB ADA
                  className="btn btn-primary" 
                  disabled={loading} // Tombol mati saat loading
                  style={{padding:'12px 24px'}}
                >
                  {loading ? 'Sedang Mengirim...' : 'Kirim Bukti Pembayaran'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* TABEL RIWAYAT */}
      <div className="card">
        <h3 style={{marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px'}}>
            <History size={20} color="var(--text-muted)"/> Riwayat Transaksi
        </h3>
        
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
                  <td>{new Date(p.createdAt).toLocaleDateString('id-ID')}</td>
                  
                  {user.role === 'rt' && (
                    <td style={{fontWeight:'600'}}>{p.user?.name}</td>
                  )}
                  
                  <td>{p.type}</td>
                  
                  <td style={{fontWeight:'bold', color:'var(--primary)'}}>
                    Rp {p.amount.toLocaleString('id-ID')}
                  </td>
                  
                  <td>{p.month}</td>
                  
                  <td style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>
                    {p.proofDescription}
                  </td>
                  
                  <td>
                    <span className={`status-badge ${p.status === 'verified' ? 'bg-green' : 'bg-yellow'}`}>
                      {p.status === 'verified' ? 'Diterima' : 'Menunggu'}
                    </span>
                  </td>
                  
                  {user.role === 'rt' && (
                    <td>
                        {p.status === 'pending' ? (
                            <button 
                                onClick={()=>handleVerify(p._id)} 
                                className="btn btn-success" 
                                style={{padding:'6px 12px', fontSize:'0.75rem'}}
                            >
                                <CheckCircle size={14}/> Verifikasi
                            </button>
                        ) : (
                            <span style={{color:'var(--primary)', fontSize:'0.8rem', fontWeight:'bold'}}>
                                ✓ Selesai
                            </span>
                        )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          
          {payments.length === 0 && (
            <div style={{textAlign:'center', padding:'40px', color:'var(--text-muted)'}}>
              <p>Belum ada data transaksi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Finance;