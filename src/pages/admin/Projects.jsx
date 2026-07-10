import { useState, useEffect } from 'react';
import { Folder, MoreVertical, Clock, Plus, Trash2, X, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Planning');
  const [progress, setProgress] = useState(0);
  const [deadline, setDeadline] = useState('');

  // Allocation states (added without touching the existing project card)
  const [users, setUsers] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [allocProject, setAllocProject] = useState('');
  const [allocUser, setAllocUser] = useState('');
  const [allocMessage, setAllocMessage] = useState(null);
  const [allocError, setAllocError] = useState(null);
  const [allocLoading, setAllocLoading] = useState(false);

  const API_URL = 'http://127.0.0.1:5000/api/projects';
  const USERS_URL = 'http://127.0.0.1:5000/api/users';
  const ALLOC_URL = 'http://127.0.0.1:5000/api/allocations';

  useEffect(() => { fetchProjects(); fetchUsers(); fetchAllocations(); }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(USERS_URL);
      const data = await res.json();
      setUsers(data.filter(u => u.role !== 'admin'));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchAllocations = async () => {
    try {
      const res = await fetch(ALLOC_URL);
      setAllocations(await res.json());
    } catch (error) {
      console.error("Error fetching allocations:", error);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!name.trim() || !deadline) return;

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, status, progress, deadline })
    });

    // Reset form and close it
    setName(''); setStatus('Planning'); setProgress(0); setDeadline('');
    setShowForm(false);
    fetchProjects();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setActiveDropdown(null);
    fetchProjects();
  };

  // Allocation handler
  const handleAllocate = async (e) => {
    e.preventDefault();
    setAllocMessage(null);
    setAllocError(null);

    if (!allocProject || !allocUser) {
      setAllocError('Please select both a project and a user.');
      return;
    }

    setAllocLoading(true);
    try {
      const res = await fetch(ALLOC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: Number(allocProject), user_id: Number(allocUser) })
      });
      const data = await res.json();
      if (!res.ok) {
        setAllocError(data.error || 'Failed to allocate project.');
        return;
      }
      setAllocMessage(data.message || 'Project allocated successfully!');
      setAllocProject('');
      setAllocUser('');
      fetchAllocations();
    } catch (err) {
      setAllocError('Could not connect to the backend. Is the Python server running?');
      console.error(err);
    } finally {
      setAllocLoading(false);
    }
  };

  const handleRemoveAllocation = async (id) => {
    try {
      await fetch(`${ALLOC_URL}/${id}`, { method: 'DELETE' });
      fetchAllocations();
    } catch (err) {
      console.error(err);
    }
  };

  const projectName = (id) => projects.find(p => p.id === id)?.name || 'Unknown';
  const userName = (id) => users.find(u => u.id === id)?.name || 'Unknown';

  // Helper to format dates to look like "May 30, 2024"
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Helper to style the status badges just like your screenshot
  const getStatusBadge = (status) => {
    let bgColor = '#fef08a';
    let textColor = '#854d0e';
    if (status === 'Completed') { bgColor = '#dcfce7'; textColor = '#166534'; }
    if (status === 'Planning') { bgColor = '#fef9c3'; textColor = '#a16207'; }
    
    return (
      <span style={{ 
        backgroundColor: bgColor, color: textColor, 
        padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' 
      }}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Projects 📁</h1>
          <p>Manage and track your ongoing projects here.</p>
        </div>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '1.5fr 1fr', alignItems: 'start' }}>
      <div className="card">
        {/* HEADER & NEW PROJECT BUTTON */}
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Active Projects</h3>
          <button 
            onClick={() => setShowForm(!showForm)} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', 
              background: '#fff', border: '1px solid #e5e7eb', padding: '8px 14px', 
              borderRadius: '8px', color: '#374151', fontWeight: '500'
            }}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />} 
            {showForm ? 'Cancel' : 'New Project'}
          </button>
        </div>

        {/* ADD NEW PROJECT FORM */}
        {showForm && (
          <form onSubmit={handleAddProject} className="add-task-form" style={{ marginBottom: '24px', backgroundColor: '#FAFAFA', padding: '20px', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1 1 200px' }}>
                <label>Project Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="E.g., Website Redesign" />
              </div>
              <div className="form-group" style={{ flex: '1 1 150px' }}>
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: '1 1 100px' }}>
                <label>Progress (%)</label>
                <input type="number" min="0" max="100" value={progress} onChange={(e) => setProgress(e.target.value)} required />
              </div>
              <div className="form-group" style={{ flex: '1 1 150px' }}>
                <label>Deadline</label>
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="submit-btn" style={{ marginTop: '16px', width: '150px' }}>Save Project</button>
          </form>
        )}

        {/* PROJECTS TABLE */}
        <div style={{ overflowX: 'auto' }}>
          <table className="task-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f3f4f6', textAlign: 'left', color: '#6b7280' }}>
                <th style={{ padding: '16px', fontWeight: '500' }}>Project Name</th>
                <th style={{ padding: '16px', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '16px', fontWeight: '500' }}>Progress</th>
                <th style={{ padding: '16px', fontWeight: '500' }}>Deadline</th>
                <th style={{ padding: '16px' }}></th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No projects yet. Click "New Project" to add one!</td>
                </tr>
              ) : (
                projects.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#374151', fontWeight: '500' }}>
                      <Folder size={18} color="#9ca3af" /> {p.name}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {getStatusBadge(p.status)}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '100px', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                          <div style={{ width: `${p.progress}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                        </div>
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={16} color="#9ca3af" /> {formatDate(p.deadline)}
                      </div>
                    </td>
                    
                    {/* THE THREE DOTS MENU */}
                    <td style={{ padding: '16px', position: 'relative', textAlign: 'right' }}>
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === p.id ? null : p.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px' }}
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      {activeDropdown === p.id && (
                        <div style={{
                          position: 'absolute', right: '30px', top: '40px', backgroundColor: '#fff',
                          border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          zIndex: 50, padding: '6px', minWidth: '120px'
                        }}>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
                              color: '#ef4444', cursor: 'pointer', padding: '8px 12px', width: '100%', textAlign: 'left', borderRadius: '6px', fontSize: '14px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Trash2 size={16}/> Delete Project
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ALLOCATE PROJECTS CARD (right side) */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={18} /> Allocate Project to Intern
          </h3>
        </div>

        {allocMessage && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#dcfce7', color: '#166534', padding: '12px 16px',
            borderRadius: '8px', marginBottom: '20px', fontSize: '14px'
          }}>
            <CheckCircle size={18} /> {allocMessage}
          </div>
        )}
        {allocError && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#fee2e2', color: '#991b1b', padding: '12px 16px',
            borderRadius: '8px', marginBottom: '20px', fontSize: '14px'
          }}>
            <AlertCircle size={18} /> {allocError}
          </div>
        )}

        <form onSubmit={handleAllocate} className="add-task-form" style={{ marginBottom: '24px' }}>
          <div className="form-group" style={{ width: '100%' }}>
            <label>Select Project</label>
            <select value={allocProject} onChange={(e) => setAllocProject(e.target.value)} required>
              <option value="">-- Choose a project --</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ width: '100%' }}>
            <label>Select Intern</label>
            <select value={allocUser} onChange={(e) => setAllocUser(e.target.value)} required>
              <option value="">-- Choose an intern --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.username})</option>
              ))}
            </select>
          </div>
          <button type="submit" className="submit-btn" disabled={allocLoading} style={{ width: '100%' }}>
            <UserPlus size={18} /> {allocLoading ? 'Allocating...' : 'Allocate'}
          </button>
        </form>

        {allocations.length === 0 ? (
          <p style={{ color: '#9ca3af', padding: '8px 0' }}>No projects allocated yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="task-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6', textAlign: 'left', color: '#6b7280' }}>
                  <th style={{ padding: '16px', fontWeight: '500' }}>Project</th>
                  <th style={{ padding: '16px', fontWeight: '500' }}>Assigned To</th>
                  <th style={{ padding: '16px' }}></th>
                </tr>
              </thead>
              <tbody>
                {allocations.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px', color: '#374151', fontWeight: '500' }}>{projectName(a.project_id)}</td>
                    <td style={{ padding: '16px', color: '#374151' }}>{userName(a.user_id)}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleRemoveAllocation(a.id)}
                        className="delete-btn"
                        title="Remove allocation"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
