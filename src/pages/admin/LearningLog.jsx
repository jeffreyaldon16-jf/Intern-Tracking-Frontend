import { useState, useEffect } from 'react';
import { BookOpen, Plus, Calendar as CalendarIcon } from 'lucide-react';

export default function LearningLog() {
  const [logs, setLogs] = useState([]);
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');

  const API_URL = 'http://127.0.0.1:5000/api/logs';

  // Fetch logs from the database when the page loads
  useEffect(() => {
    fetchLogs();
  }, []);

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
    
    // Send the new log to the database
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        date: currentDate, 
        topic: topic, 
        notes: notes 
      })
    });
    
    // Clear the form and fetch the updated list
    setTopic('');
    setNotes('');
    fetchLogs();
  };

  return (
    <div>
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Learning Log 📖</h1>
          <p>Document your daily learnings and achievements for your final report.</p>
        </div>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        
        {/* Left Column: Form */}
        <div className="card add-task-card" style={{ alignSelf: 'start' }}>
          <div className="card-header">
            <h3>New Entry</h3>
          </div>
          <form onSubmit={addLog} className="add-task-form">
            <div className="form-group">
              <label>Topic / Skill Learned</label>
              <input 
                type="text" 
                placeholder="E.g., API Integration" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                required
              />
            </div>
            <div className="form-group">
              <label>Key Takeaways</label>
              <textarea 
                placeholder="What did you accomplish or figure out today?" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                required
                style={{
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  minHeight: '120px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <button type="submit" className="submit-btn">
              <Plus size={18} /> Save Entry
            </button>
          </form>
        </div>

        {/* Right Column: Past Logs */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={20} color="#6b7280" /> Past Entries
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {logs.length === 0 ? (
              <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                No entries yet. Start logging your journey!
              </p>
            ) : (
              logs.map(log => (
                <div key={log.id} style={{ padding: '16px', border: '1px solid #f3f4f6', borderRadius: '12px', backgroundColor: '#FAFAFA' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '16px', color: '#1f2937', margin: 0 }}>{log.topic}</h4>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280', backgroundColor: '#e5e7eb', padding: '4px 8px', borderRadius: '12px' }}>
                      <CalendarIcon size={12} /> {log.date}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5', margin: 0 }}>{log.notes}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}