import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'; 
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/guestbook";

const Guestbook = () => {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setEntries(response.data);
      setError(null);
    } catch (err) {
      setError("The server is waking up... please wait a moment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ name: '', message: '' });
      fetchEntries();
    } catch (err) {
      alert("Failed to save entry.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchEntries();
      } catch (err) {
        alert("Failed to delete.");
      }
    }
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setFormData({ name: entry.name, message: entry.message });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Guestbook</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Your Name" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <textarea 
          placeholder="Leave a message..." 
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', minHeight: '80px' }}
        />
        <button type="submit" style={{ cursor: 'pointer', padding: '8px 16px' }}>
          {editingId ? "Update Entry" : "Sign Guestbook"}
        </button>
        {editingId && (
          <button onClick={() => setEditingId(null)} style={{ marginLeft: '10px' }}>
            Cancel
          </button>
        )}
      </form>

      <hr />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>☕ Waking up the server... This may take 30 seconds on the first load.</p>
        </div>
      ) : error ? (
        <p style={{ color: 'orange' }}>{error}</p>
      ) : (
        <div>
          {entries.length === 0 && <p>No entries yet. Be the first!</p>}
          {entries.map((entry) => (
            <div key={entry.id} style={{ borderBottom: '1px solid #ddd', padding: '15px 0' }}>
              <strong>{entry.name}</strong>
              <p>{entry.message}</p>
              <button onClick={() => startEdit(entry)} style={{ marginRight: '10px' }}>Edit</button>
              <button onClick={() => handleDelete(entry.id)} style={{ color: 'red' }}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Guestbook />
    </React.StrictMode>
  );
}

export default Guestbook;