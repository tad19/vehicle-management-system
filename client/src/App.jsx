import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching from our updated vehicle endpoint
    axios.get('http://localhost:5000/api/vehicles')
      .then((response) => {
        setVehicles(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles from server.');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Fleet Vehicle Management System</h1>
      <p style={{ color: '#666' }}>Connected to MongoDB via Express Backend!</p>

      <hr style={{ margin: '20px 0' }} />

      <h2>Vehicle Fleet</h2>

      {loading && <p>Loading vehicles...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && vehicles.length === 0 && (
        <p>No vehicles found in the database yet. Next, we will build a form to add some!</p>
      )}

      <ul>
        {vehicles.map((vehicle) => (
          <li key={vehicle._id} style={{ marginBottom: '10px', background: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
            <strong>{vehicle.name}</strong> ({vehicle.type}) - Status: <em>{vehicle.status}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;