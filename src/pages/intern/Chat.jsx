import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const API_URL = 'http://127.0.0.1:5000/api/messages';

  useEffect(() => { fetchMessages(); }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const userName = localStorage.getItem('userName') || 'Intern';
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: userName,
          sender_role: 'intern',
          text: newMessage
        })
      });
      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      alert("Could not send message. Check backend server.");
      console.error(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const userName = localStorage.getItem('userName') || 'Intern';

  return (
    <div>
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Chat with Admin</h1>
          <p>Send messages to your admin and get replies in real-time.</p>
        </div>
      </div>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 260px)' }}>
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="#3b82f6" /> Conversations
          </h3>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: '#FAFAFA', borderRadius: '12px', marginBottom: '16px' }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>Loading messages...</p>
          ) : messages.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>No messages yet. Say hello!</p>
          ) : (
            messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === userName ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: msg.sender === userName ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  background: msg.sender === userName ? '#1f2937' : '#fff',
                  color: msg.sender === userName ? '#fff' : '#374151',
                  border: msg.sender === userName ? 'none' : '1px solid #f3f4f6',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: msg.sender === userName ? '#fcd34d' : '#3b82f6' }}>
                    {msg.sender} {msg.sender_role === 'admin' ? '(Admin)' : ''}
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: '1.4', marginBottom: '4px' }}>{msg.text}</div>
                  <div style={{ fontSize: '10px', color: msg.sender === userName ? 'rgba(255,255,255,0.5)' : '#9ca3af', textAlign: 'right' }}>
                    {msg.timestamp ? msg.timestamp.split(' ')[1] : ''}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none' }}
          />
          <button onClick={sendMessage} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#111827', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}>
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
