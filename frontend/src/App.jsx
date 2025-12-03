// frontend/src/App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RequestLetter from './pages/RequestLetter';
import Complaints from './pages/Complaints';

// Layout Component Baru
import Layout from './components/Layout';

// Proteksi Route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // Jika ada token, bungkus konten dengan Layout 3 Panel
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      {/* Navbar lama dihapus karena sudah digantikan Layout */}
      
      <Routes>
        {/* Halaman Public (Tanpa Sidebar/Header) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Halaman Private (Otomatis pakai Sidebar & Header) */}
        <Route path="/" element={
           <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        
        <Route path="/request" element={
           <PrivateRoute><RequestLetter /></PrivateRoute>
        } />

        <Route path="/complaints" element={
           <PrivateRoute><Complaints /></PrivateRoute>
        } />
        
      </Routes>
    </Router>
  );
}

export default App;