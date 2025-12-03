import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RequestLetter from './pages/RequestLetter';
import Navbar from './components/Navbar';
import './App.css'; // Import CSS juga disini untuk keamanan

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/request" element={<PrivateRoute><RequestLetter /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;