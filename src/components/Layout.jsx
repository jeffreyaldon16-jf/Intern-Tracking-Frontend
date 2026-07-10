import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Home, Layers, Calendar, FileText, Settings, 
  Search, Bell, Sun, Moon, CheckCircle, BookOpen, MessageSquare,
  X, Clock, AlertCircle, UserPlus, FileEdit, Award, LogOut
} 
from 'lucide-react';


export default function Layout() {
  const role = localStorage.getItem('userRole');
  const name = localStorage.getItem('userName');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: <UserPlus size={16} />,
      text: 'New intern Sarah Johnson has joined the team.',
      time: '2 min ago',
      category: 'recent',
      read: false
    },
    {
      id: 2,
      icon: <FileEdit size={16} />,
      text: 'Task "API Documentation" has been updated by Alex.',
      time: '15 min ago',
      category: 'recent',
      read: false
    },
    {
      id: 3,
      icon: <Award size={16} />,
      text: 'You have been assigned as reviewer for Project Alpha.',
      time: '1 hour ago',
      category: 'recent',
      read: false
    },
    {
      id: 4,
      icon: <Clock size={16} />,
      text: 'Reminder: Weekly standup meeting in 30 minutes.',
      time: '3 hours ago',
      category: 'earlier',
      read: true
    },
    {
      id: 5,
      icon: <AlertCircle size={16} />,
      text: 'Project Beta deadline has been moved to next Friday.',
      time: 'Yesterday',
      category: 'yesterday',
      read: true
    },
    {
      id: 6,
      icon: <CheckCircle size={16} />,
      text: 'Task "Database Migration" has been completed.',
      time: 'Yesterday',
      category: 'yesterday',
      read: true
    },
    {
      id: 7,
      icon: <MessageSquare size={16} />,
      text: 'New comment on your pull request #42.',
      time: '2 days ago',
      category: 'older',
      read: true
    }
  ]);
  const notifRef = useRef(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // 1. New States for the Global Search Dropdown
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
  };
  const searchInputRef = useRef(null);

  // 2. Define all the searchable pages in your app
  const menuItems =
  role === "admin"
    ? [
        { name: "Dashboard", path: "/dashboard", icon: <Home size={16} /> },
        { name: "Projects", path: "/dashboard/projects", icon: <Layers size={16} /> },
        { name: "Tasks", path: "/dashboard/tasks", icon: <CheckCircle size={16} /> },
        { name: "Learning Log", path: "/dashboard/learning-log", icon: <BookOpen size={16} /> },
        { name: "Calendar", path: "/dashboard/calendar", icon: <Calendar size={16} /> },
        { name: "Reports", path: "/dashboard/reports", icon: <FileText size={16} /> },
        { name: "Add Intern", path: "/dashboard/add-intern", icon: <UserPlus size={16} /> },
        { name: "Settings", path: "/dashboard/settings", icon: <Settings size={16} /> },
        { name: "Chat", path: "/dashboard/chat", icon: <MessageSquare size={16} /> },
      ]
    : [
        { name: "Dashboard", path: "/intern-dashboard", icon: <Home size={16} /> },
        { name: "My Tasks", path: "/intern-dashboard/my-tasks", icon: <CheckCircle size={16} /> },
        { name: "Learning Log", path: "/intern-dashboard/learning-log", icon: <BookOpen size={16} /> },
        { name: "Calendar", path: "/intern-dashboard/calendar", icon: <Calendar size={16} /> },
        { name: "Chat", path: "/intern-dashboard/chat", icon: <FileText size={16} /> },
        { name: "Profile", path: "/intern-dashboard/profile", icon: <Settings size={16} /> },
      ];
 

  // 3. Filter the menu based on what the user types
  const filteredPages = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dark Mode Logic
  useEffect(() => {
    if (isDarkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [isDarkMode]);

  // Keyboard Shortcut Logic (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); 
        searchInputRef.current?.focus(); 
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 4. Action when user clicks a Page in the dropdown
  const handlePageClick = (path) => {
    navigate(path);
    setSearchQuery('');
    setIsSearchActive(false);
    searchInputRef.current?.blur();
  };

  // 5. Action when user clicks "Search Tasks" in the dropdown
  const handleTaskSearchClick = () => {
    navigate( role=== "admin" ? `/dashboard/tasks?q=${searchQuery}` : `/intern-dashboard/MyTasks?q=${searchQuery}`); 
    setSearchQuery('');
    setIsSearchActive(false);
    searchInputRef.current?.blur();
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Group notifications by category
  const groupedNotifications = {
    recent: notifications.filter(n => n.category === 'recent'),
    earlier: notifications.filter(n => n.category === 'earlier'),
    yesterday: notifications.filter(n => n.category === 'yesterday'),
    older: notifications.filter(n => n.category === 'older'),
  };

  const categoryLabels = {
    recent: 'Recent',
    earlier: 'Earlier Today',
    yesterday: 'Yesterday',
    older: 'Older',
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-container">
          <h2>InternTrack</h2>
        </div>
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.name === "Dashboard"}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        {/* TOP HEADER */}
        <header className="top-header">
          <div className="search-bar" style={{ position: 'relative' }}>
            <Search size={18} color="#9ca3af" />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search pages or tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setTimeout(() => setIsSearchActive(false), 200)}
            />
            <span className="shortcut-key">⌘K</span>

            {/* SEARCH DROPDOWN MENU */}
            {isSearchActive && searchQuery && (
              <div style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                width: '100%',
                background: isDarkMode ? '#1f2937' : '#fff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                zIndex: 50,
                overflow: 'hidden'
              }}>
                {filteredPages.length > 0 && (
                  <div style={{ padding: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#9ca3af', padding: '4px 8px', textTransform: 'uppercase' }}>
                      Navigate to Menu
                    </div>
                    {filteredPages.map(page => (
                      <div 
                        key={page.path}
                        onClick={() => handlePageClick(page.path)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px', padding: '10px',
                          cursor: 'pointer', borderRadius: '8px', color: isDarkMode ? '#f9fafb' : '#1f2937'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {page.icon} {page.name}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ borderTop: `1px solid ${isDarkMode ? '#374151' : '#f3f4f6'}`, padding: '8px' }}>
                   <div 
                      onClick={handleTaskSearchClick}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px',
                        cursor: 'pointer', borderRadius: '8px', color: '#10b981', fontWeight: '500'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#dcfce7'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Search size={16} /> Search tasks for "{searchQuery}"
                    </div>
                </div>
              </div>
            )}
          </div>

          <div className="header-actions">
            <div className="user-profile">
              <div className="avatar">{name ? name.charAt(0).toUpperCase() : 'U'}</div>
              <div className="user-info">
                <span className="user-name">{name}</span>
                <span className="user-role">{role==="admin" ? "super admin" : "Intern"}</span>
              </div>
            </div>
            <button className="icon-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Moon size={20} color="#fcd34d" /> : <Sun size={20} />}
            </button>
            {/* NOTIFICATION BELL WITH DROPDOWN */}
            <div className="notification-wrapper" ref={notifRef}>
              <button 
                className="icon-btn notification" 
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="badge">{unreadCount}</span>
                )}
              </button>
              {showNotifications && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <h4>Notifications</h4>
                    {unreadCount > 0 && (
                      <button className="notif-mark-read" onClick={markAllAsRead}>
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div className="notif-empty">
                        <Bell size={32} />
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      Object.entries(groupedNotifications).map(([category, items]) => 
                        items.length > 0 && (
                          <div key={category}>
                            <div className="notif-category-label">{categoryLabels[category]}</div>
                            {items.map(notif => (
                              <div 
                                key={notif.id} 
                                className={`notif-item ${!notif.read ? 'notif-unread' : ''}`}
                                onClick={() => markAsRead(notif.id)}
                              >
                                <div className="notif-icon">
                                  {notif.icon}
                                </div>
                                <div className="notif-content">
                                  <p className="notif-text">{notif.text}</p>
                                  <span className="notif-time">{notif.time}</span>
                                </div>
                                {!notif.read && <span className="notif-dot"></span>}
                              </div>
                            ))}
                          </div>
                        )
                      )
                    )}
                  </div>
                  <div className="notif-footer">
                    <button className="notif-view-all">View all notifications</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}