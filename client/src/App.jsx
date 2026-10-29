import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // Auth State
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between Login and Register

  // Form input state for Auth
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' });

  // Vehicle State
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Sedan',
    vinOrSerialNumber: '',
    status: 'Available',
    mileage: 0,
    location: ''
  });

  // Fetch vehicles when token changes (i.e. user logs in)
  useEffect(() => {
    if (token) {
      fetchVehicles();
    }
  }, [token]);

  const fetchVehicles = () => {
    axios.get('http://localhost:5000/api/vehicle')
      .then((response) => {
        setVehicles(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles from server.');
        setLoading(false);
      });
  };

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  // Handle Login or Registration submission
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    
    axios.post(`http://localhost:5000${endpoint}`, authForm)
      .then((response) => {
        if (isRegistering) {
          alert('Registration successful! Please log in now.');
          setIsRegistering(false);
        } else {
          // Save token and user details to localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setToken(response.data.token);
          setUser(response.data.user);
          alert(`Welcome back, ${response.data.user.username}!`);
        }
      })
      .catch((err) => {
        alert('Authentication failed: ' + (err.response?.data?.error || err.message));
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  const handleVehicleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVehicleSubmit = (e) => {
    e.preventDefault();
    // Send token in Authorization header
    axios.post('http://localhost:5000/api/vehicle', formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setVehicles([...vehicles, response.data]);
        setFormData({ name: '', type: 'Sedan', vinOrSerialNumber: '', status: 'Available', mileage: 0, location: '' });
        alert('Vehicle added successfully!');
      })
      .catch((err) => {
        alert('Failed to add vehicle: ' + (err.response?.data?.error || err.message));
      });
  };

  // --- IF NOT LOGGED IN: SHOW LOGIN/REGISTER SCREEN ---
  if (!token) {
    return (
      <div style={{ maxWidth: '400px', margin: '80px auto', fontFamily: 'Arial, sans-serif', padding: '20px', background: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center' }}>{isRegistering ? 'Create Account' : 'Fleet Login'}</h2>
        <form onSubmit={handleAuthSubmit} style={{ display: 'grid', gap: '12px' }}>
          {isRegistering && (
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Username:</label>
              <input type="text" name="username" value={authForm.username} onChange={handleAuthChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Email:</label>
            <input type="email" name="email" value={authForm.email} onChange={handleAuthChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Password:</label>
            <input type="password" name="password" value={authForm.password} onChange={handleAuthChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" style={{ background: '#007BFF', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            {isRegistering ? 'Register' : 'Log In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsRegistering(!isRegistering)} style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', textDecoration: 'underline', font: 'inherit' }}>
            {isRegistering ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    );
  }

  // --- IF LOGGED IN: SHOW MAIN APP ---
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Vehicle Fleet Management</h1>
          <p style={{ color: '#666', margin: 0 }}>Logged in as: <strong>{user?.username}</strong> ({user?.role})</p>
        </div>
        <button onClick={handleLogout} style={{ background: '#dc3545', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Log Out
        </button>
      </div>

      <hr style={{ margin: '20px 0' }} />

      {/* --- ADD VEHICLE FORM (Admins only or all users depending on your backend rules) --- */}
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2>Add New Vehicle</h2>
        <form onSubmit={handleVehicleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Vehicle Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleVehicleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="e.g., Ford Transit Van" />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Type:</label>
            <select name="type" value={formData.type} onChange={handleVehicleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Pickup Truck">Pickup Truck</option>
              <option value="Van">Van</option>
              <option value="Semi-Truck">Semi-Truck</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>VIN or Serial Number:</label>
            <input type="text" name="vinOrSerialNumber" value={formData.vinOrSerialNumber} onChange={handleVehicleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="e.g., 1FTBR3B8..." />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Status:</label>
            <select name="status" value={formData.status} onChange={handleVehicleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
              <option value="Available">Available</option>
              <option value="In Transit">In Transit</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Decommissioned">Decommissioned</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Mileage:</label>
            <input type="number" name="mileage" value={formData.mileage} onChange={handleVehicleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Location:</label>
            <input type="text" name="location" value={formData.location} onChange={handleVehicleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="e.g., Main Warehouse" />
          </div>
          <button type="submit" style={{ background: '#007BFF', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            Add Vehicle
          </button>
        </form>
      </div>

      {/* --- VEHICLE LIST --- */}
      <h2>Fleet Inventory</h2>
      {loading && <p>Loading vehicles...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && vehicles.length === 0 && <p>No vehicles found.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {vehicles.map((v) => (
          <li key={v._id} style={{ marginBottom: '12px', background: '#f9f9f9', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #007BFF' }}>
            <strong>{v.name}</strong> ({v.type})<br />
            <span>VIN: {v.vinOrSerialNumber}</span> | <span>Status: <strong>{v.status}</strong></span><br />
            <span>Mileage: {v.mileage} miles</span> {v.location && <span>| Location: {v.location}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;