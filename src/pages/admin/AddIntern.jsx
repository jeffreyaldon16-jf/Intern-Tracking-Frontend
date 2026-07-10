import { useState } from 'react';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

export default function AddIntern() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('intern');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://127.0.0.1:5000/api/users';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!name.trim() || !username.trim() || !password.trim()) {
      setError('Name, username and password are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password, role })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to add user.');
        return;
      }

      setMessage(data.message || 'User added successfully!');
      setName('');
      setUsername('');
      setPassword('');
      setRole('intern');
    } catch (err) {
      setError('Could not connect to the backend. Is the Python server running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Add Intern 👤</h1>
          <p>Create a new intern (or admin) account.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '520px' }}>
        {message && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#dcfce7', color: '#166534', padding: '12px 16px',
            borderRadius: '8px', marginBottom: '20px', fontSize: '14px'
          }}>
            <CheckCircle size={18} /> {message}
          </div>
        )}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#fee2e2', color: '#991b1b', padding: '12px 16px',
            borderRadius: '8px', marginBottom: '20px', fontSize: '14px'
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-task-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="e.g. jane_doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Set a temporary password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="intern">Intern</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            <UserPlus size={18} /> {loading ? 'Adding...' : 'Add User'}
          </button>
        </form>
      </div>
    </div>
  );
}