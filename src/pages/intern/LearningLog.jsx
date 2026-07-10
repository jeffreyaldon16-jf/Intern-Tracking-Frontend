import { useState, useEffect } from 'react';
import { BookOpen, Plus, Calendar as CalendarIcon, Trash2 } from 'lucide-react';

export default function LearningLog() {
  const [logs, setLogs] = useState([]);
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const API_URL = 'http://127.0.0.1:5000/api/logs';

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const addLog = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !notes.trim()) return;
    const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: currentDate, topic: topic, notes: notes })
    });
    setTopic('');
    setNotes('');
    fetchLogs();
  };

  const deleteLog = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchLogs();
    }
  };

  return (
    <div>
      <div className="welcome-section" style={{ marginBottom: '10px' }}>
        <div className="welcome-text">
          <h1 style={{ fontSize: '18px' }}>Learning Log</h1>
          <p style={{ fontSize: '12px' }}>Document your daily learnings and achievements.</p>
        </div>
      </div>
      
      {/* New Entry Form */}
      <div className="card" style={{ marginBottom: '10px', padding: '12px' }}>
        <div className="card-header" style={{ marginBottom: '10px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600' }}>New Entry</h3>
        </div>
        <form onSubmit={addLog} className="add-task-form">
          <div className="form-group">
            <label style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563' }}>Topic / Skill Learned</label>
            <input 
              type="text" 
              placeholder="E.g., API Integration" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              required 
              style={{ fontSize: '13px', padding: '8px 10px' }}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '12px', fontWeight: '500', color: '#4b5563' }}>Key Takeaways</label>
            <textarea 
              placeholder="What did you accomplish or figure out today?" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              required
              style={{ padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>
          <button type="submit" className="submit-btn" style={{ padding: '10px', fontSize: '14px' }}>
            <Plus size={16} /> Save Entry
          </button>
        </form>
      </div>

      {/* Past Entries */}
      <div className="card" style={{ padding: '10px' }}>
        <div className="card-header" style={{ marginBottom: '8px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600' }}>
            <BookOpen size={18} color="#6b7280" /> Past Entries
          </h3>
        </div>
        <div style={{ maxHeight: 'calc(100vh - 380px)', overflowY: 'auto' }}>
          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px 8px', color: '#6b7280' }}>
              <BookOpen size={24} color="#9ca3af" style={{ marginBottom: '6px', opacity: 0.5 }} />
              <p style={{ fontSize: '11px', fontStyle: 'italic', lineHeight: '1.4' }}>No entries yet.</p>
              <p style={{ fontSize: '11px', fontStyle: 'italic', lineHeight: '1.4' }}>Start logging your journey!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {logs.map(log => (
                <div key={log.id} style={{ padding: '8px', border: '1px solid #f3f4f6', borderRadius: '6px', backgroundColor: '#FAFAFA' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', gap: '4px' }}>
                    <h4 style={{ fontSize: '12px', color: '#1f2937', margin: 0, fontWeight: '600', flex: 1, wordBreak: 'break-word', lineHeight: '1.3' }}>{log.topic}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '9px', color: '#6b7280', backgroundColor: '#e5e7eb', padding: '2px 5px', borderRadius: '4px', whiteSpace: 'nowrap', marginTop: '1px' }}>
                        <CalendarIcon size={8} /> {log.date}
                      </span>
                      <button 
                        onClick={() => deleteLog(log.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                        title="Delete entry"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: '#4b5563', lineHeight: '1.3', margin: 0, wordBreak: 'break-word' }}>{log.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
