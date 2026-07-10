import { User, Lock, Bell, Mail, MessageSquare, Calendar, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    taskAssignments: true,
    projectUpdates: false,
    chatMessages: true,
    deadlineReminders: true,
    weeklyReports: false,
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationOptions = [
    { key: 'emailNotifications', label: 'Email Notifications', icon: <Mail size={18} color="#6b7280" />, description: 'Receive notifications via email' },
    { key: 'taskAssignments', label: 'Task Assignments', icon: <CheckCircle size={18} color="#6b7280" />, description: 'When a task is assigned to you' },
    { key: 'projectUpdates', label: 'Project Updates', icon: <Calendar size={18} color="#6b7280" />, description: 'Changes in project status or progress' },
    { key: 'chatMessages', label: 'Chat Messages', icon: <MessageSquare size={18} color="#6b7280" />, description: 'New messages in team chat' },
    { key: 'deadlineReminders', label: 'Deadline Reminders', icon: <Bell size={18} color="#6b7280" />, description: 'Reminders before task deadlines' },
    { key: 'weeklyReports', label: 'Weekly Reports', icon: <Lock size={18} color="#6b7280" />, description: 'Weekly summary of your activities' },
  ];

  return (
    <div>
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Settings ⚙️</h1>
          <p>Manage your account preferences and profile.</p>
        </div>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '1fr', gap: '12px' }}>
        {/* Profile Information Card */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#6b7280" /> Profile Information
            </h3>
          </div>
          <form className="add-task-form">
            <div className="form-group">
              <label style={{ fontSize: '12px' }}>Full Name</label>
              <input type="text" defaultValue="Admin User" style={{ fontSize: '13px', padding: '8px 10px' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '12px' }}>Email Address</label>
              <input type="email" defaultValue="admin@interntrack.com" style={{ fontSize: '13px', padding: '8px 10px' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '12px' }}>Role</label>
              <input type="text" defaultValue="Super Admin" disabled style={{ backgroundColor: '#f3f4f6', fontSize: '13px', padding: '8px 10px' }} />
            </div>
            <button type="button" className="submit-btn" style={{ width: '100%' }}>Save Changes</button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} color="#6b7280" /> Change Password
            </h3>
          </div>
          <form className="add-task-form">
            <div className="form-group">
              <label style={{ fontSize: '12px' }}>Current Password</label>
              <input type="password" placeholder="Enter current password" style={{ fontSize: '13px', padding: '8px 10px' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '12px' }}>New Password</label>
              <input type="password" placeholder="Enter new password" style={{ fontSize: '13px', padding: '8px 10px' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '12px' }}>Confirm New Password</label>
              <input type="password" placeholder="Confirm new password" style={{ fontSize: '13px', padding: '8px 10px' }} />
            </div>
            <button type="button" className="submit-btn" style={{ width: '100%' }}>Update Password</button>
          </form>
        </div>

        {/* Notification Preferences Card - Full Width */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="#6b7280" /> Notification Preferences
            </h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="task-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '40%', fontSize: '12px' }}>Type</th>
                  <th style={{ width: '40%', fontSize: '12px' }}>Description</th>
                  <th style={{ width: '20%', textAlign: 'center', fontSize: '12px' }}>Enabled</th>
                </tr>
              </thead>
              <tbody>
                {notificationOptions.map((option) => (
                  <tr key={option.key}>
                    <td data-label="Type">
                      <div className="task-name-cell" style={{ gap: '6px' }}>
                        {option.icon}
                        <span style={{ fontSize: '12px' }}>{option.label}</span>
                      </div>
                    </td>
                    <td data-label="Description" className="date-cell" style={{ fontSize: '11px' }}>{option.description}</td>
                    <td data-label="Enabled" style={{ textAlign: 'center' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '6px' }}>
                        <input
                          type="checkbox"
                          checked={notifications[option.key]}
                          onChange={() => toggleNotification(option.key)}
                          className="custom-checkbox"
                        />
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 500,
                          padding: '2px 6px',
                          borderRadius: '10px',
                          backgroundColor: notifications[option.key] ? '#dcfce7' : '#f3f4f6',
                          color: notifications[option.key] ? '#166534' : '#6b7280',
                        }}>
                          {notifications[option.key] ? 'On' : 'Off'}
                        </span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}