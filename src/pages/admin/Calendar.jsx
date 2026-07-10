import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Folder, CheckCircle, Calendar as CalendarIcon, Clock } from 'lucide-react';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);

  const PROJECTS_API = 'http://127.0.0.1:5000/api/projects';
  const TASKS_API = 'http://127.0.0.1:5000/api/tasks';

  useEffect(() => {
    fetchProjectsAndTasks();
  }, []);

  const fetchProjectsAndTasks = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        fetch(PROJECTS_API),
        fetch(TASKS_API)
      ]);
      const projData = await projRes.json();
      const taskData = await taskRes.json();
      setProjects(projData);
      setTasks(taskData);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };

  // Calendar math navigation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper: Format day string to match HTML <input type="date"> format (YYYY-MM-DD)
  const formatToDateString = (dayNum) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Get events falling on a specific date string (YYYY-MM-DD)
  const getEventsForDate = (dateStr) => {
    const dayProjects = projects.filter(p => p.deadline === dateStr);
    const dayTasks = tasks.filter(t => t.due_date === dateStr);
    return { dayProjects, dayTasks };
  };

  // Generate grid cells
  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(<div key={`empty-${i}`} style={{ padding: '4px', minHeight: '50px', background: '#FAFAFA', opacity: 0.4, borderRadius: '4px' }}></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatToDateString(day);
    const { dayProjects, dayTasks } = getEventsForDate(dateStr);
    const totalEvents = dayProjects.length + dayTasks.length;

    const isToday = 
      day === new Date().getDate() && 
      month === new Date().getMonth() && 
      year === new Date().getFullYear();

    calendarCells.push(
      <div 
        key={day} 
        onClick={() => setSelectedDayEvents({ day, dateStr, dayProjects, dayTasks })}
        style={{
          padding: '4px',
          minHeight: '50px',
          background: isToday ? '#FEF3C7' : '#fff',
          border: '1px solid #f3f4f6',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: isToday ? '700' : '500', color: isToday ? '#92400e' : '#374151', fontSize: '11px' }}>{day}</span>
          {totalEvents > 0 && (
            <span style={{ fontSize: '9px', background: '#1f2937', color: '#fff', padding: '1px 4px', borderRadius: '6px' }}>
              {totalEvents}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '3px' }}>
          {dayProjects.map(p => (
            <div key={`proj-${p.id}`} style={{ fontSize: '9px', background: '#dbeafe', color: '#1e40af', padding: '2px 3px', borderRadius: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              📁 {p.name}
            </div>
          ))}
          {dayTasks.map(t => (
            <div key={`task-${t.id}`} style={{ fontSize: '9px', background: t.completed ? '#dcfce7' : '#fef08a', color: t.completed ? '#166534' : '#854d0e', padding: '2px 3px', borderRadius: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              📌 {t.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="welcome-section" style={{ marginBottom: '10px' }}>
        <div className="welcome-text">
          <h1 style={{ fontSize: '18px' }}>Calendar</h1>
          <p style={{ fontSize: '12px' }}>Project deadlines and task due dates.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '10px' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{monthNames[month]} {year}</h2>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={prevMonth} className="view-all-btn" style={{ display: 'flex', alignItems: 'center', padding: '3px 6px' }}><ChevronLeft size={14} /></button>
            <button onClick={() => setCurrentDate(new Date())} className="view-all-btn" style={{ fontSize: '11px', padding: '3px 8px' }}>Today</button>
            <button onClick={nextMonth} className="view-all-btn" style={{ display: 'flex', alignItems: 'center', padding: '3px 6px' }}><ChevronRight size={14} /></button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px', textAlign: 'center', fontWeight: '600', fontSize: '10px', color: '#6b7280' }}>
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>

        {/* Calendar Day Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
          {calendarCells}
        </div>
      </div>

      {/* SIDE PANEL: SELECTED DAY DETAILS */}
      {selectedDayEvents && (
        <div className="card" style={{ marginTop: '10px', padding: '10px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '13px' }}>{monthNames[month]} {selectedDayEvents.day}</h3>
            <button onClick={() => setSelectedDayEvents(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '14px' }}>✕</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedDayEvents.dayProjects.length === 0 && selectedDayEvents.dayTasks.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '11px', textAlign: 'center', padding: '12px 0' }}>No events scheduled.</p>
            ) : (
              <>
                {/* Show Projects */}
                {selectedDayEvents.dayProjects.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '600' }}>Projects</h4>
                    {selectedDayEvents.dayProjects.map(p => (
                      <div key={p.id} style={{ padding: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', color: '#1e40af', fontSize: '11px' }}>
                          <Folder size={12} /> {p.name}
                        </div>
                        <div style={{ fontSize: '10px', color: '#3b82f6', marginTop: '2px' }}>{p.status} ({p.progress}%)</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Show Tasks */}
                {selectedDayEvents.dayTasks.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '600' }}>Tasks</h4>
                    {selectedDayEvents.dayTasks.map(t => (
                      <div key={t.id} style={{ padding: '6px', background: t.completed ? '#f0fdf4' : '#fefce8', border: `1px solid ${t.completed ? '#bbf7d0' : '#fef08a'}`, borderRadius: '4px', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500', color: t.completed ? '#166534' : '#854d0e', fontSize: '11px', textDecoration: t.completed ? 'line-through' : 'none' }}>
                          <CheckCircle size={12} /> {t.title}
                        </div>
                        <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>{t.priority} priority</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}