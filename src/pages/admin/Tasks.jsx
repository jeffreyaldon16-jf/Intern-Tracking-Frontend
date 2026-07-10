import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Trash2, Plus, SearchX, Paperclip, Download } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [file, setFile] = useState(null);

  // Search feature hooks
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const API_URL = 'http://127.0.0.1:5000/api/tasks';

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks. Is the backend running?", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('due_date', dueDate);
      formData.append('priority', priority);
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        alert("Database Error! Your Python server might have crashed.");
        return;
      }

      // Clear the form only if the save was successful
      setTitle(''); setDueDate(''); setPriority('Medium'); setFile(null);
      fetchTasks();
    } catch (error) {
      alert("Connection Failed! Please make sure your Python backend (app.py) is currently running in a terminal.");
      console.error(error);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      });
      fetchTasks();
    } catch (error) {
      alert("Could not update task. Check backend server.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (error) {
      alert("Could not delete task. Check backend server.");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const downloadFile = async (filePath, fileName) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/uploads/${filePath}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Could not download file. Please try again.');
      console.error(error);
    }
  };

  // 1. FILTER TASKS BASED ON SEARCH QUERY
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 2. SPLIT THE ALREADY FILTERED TASKS
  const pendingTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  return (
    <div>
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Task Management 📋</h1>
          <p>Organize, prioritize, and complete your work.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <form onSubmit={addTask} className="add-task-form" style={{ flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
          <div className="form-group" style={{ flex: '2', minWidth: '200px' }}>
            <label>Task Title</label>
            <input type="text" placeholder="What needs to be done?" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group" style={{ flex: '1', minWidth: '140px' }}>
            <label>Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </div>
          <div className="form-group" style={{ flex: '1', minWidth: '120px' }}>
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: '1', minWidth: '160px' }}>
            <label>Attach File</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="file"
                id="file-upload-admin"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label
                htmlFor="file-upload-admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#374151',
                  background: '#fff',
                  whiteSpace: 'nowrap'
                }}
              >
                <Paperclip size={16} />
                {file ? file.name : 'Choose File'}
              </label>
              {file && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '4px'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <button type="submit" className="submit-btn" style={{ marginTop: '0', height: '42px', alignSelf: 'flex-end' }}>
            <Plus size={18} /> Add
          </button>
        </form>
      </div>

      {/* Show message if search results are empty */}
      {searchQuery && filteredTasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <SearchX size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
          <h3>No tasks found matching "{searchQuery}"</h3>
          <p>Try searching for a different keyword.</p>
        </div>
      )}

      {/* Side-by-Side Task Lists */}
      <div className="content-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        
        <div className="card">
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#dd6b20" /> Pending ({pendingTasks.length})
            </h3>
          </div>
          <div className="task-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingTasks.map(task => (
              <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #f3f4f6', borderRadius: '8px', background: '#FAFAFA', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <input type="checkbox" className="custom-checkbox" checked={task.completed} onChange={() => toggleComplete(task.id, task.completed)} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: '500', color: '#374151', display: 'block', marginBottom: '4px' }}>{task.title}</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                      <span className="date-cell" style={{ fontSize: '12px' }}>{task.due_date}</span>
                      {task.file_name && (
                        <button
                          onClick={() => downloadFile(task.file_path, task.file_name)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: '#2563eb',
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '4px',
                            padding: '2px 8px',
                            cursor: 'pointer',
                            maxWidth: '100%'
                          }}
                        >
                          <Download size={12} />
                          {task.file_name.length > 20 ? task.file_name.substring(0, 17) + '...' : task.file_name}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => deleteTask(task.id)} style={{ flexShrink: 0 }}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} color="#166534" /> Completed ({completedTasks.length})
            </h3>
          </div>
          <div className="task-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {completedTasks.map(task => (
              <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #f3f4f6', borderRadius: '8px', background: '#FAFAFA', opacity: 0.6, gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <input type="checkbox" className="custom-checkbox" checked={task.completed} onChange={() => toggleComplete(task.id, task.completed)} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: '500', color: '#6b7280', textDecoration: 'line-through', display: 'block', marginBottom: '4px' }}>{task.title}</span>
                    {task.file_name && (
                      <button
                        onClick={() => downloadFile(task.file_path, task.file_name)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          color: '#2563eb',
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          cursor: 'pointer',
                          maxWidth: '100%'
                        }}
                      >
                        <Download size={12} />
                        {task.file_name}
                      </button>
                    )}
                  </div>
                </div>
                <button className="delete-btn" onClick={() => deleteTask(task.id)} style={{ flexShrink: 0 }}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}