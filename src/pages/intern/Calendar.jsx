import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Folder, CheckCircle, Calendar as CalendarIcon, Clock } from 'lucide-react';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);
  const PROJECTS_API = 'http://127.0.0.1:5000/api/projects';
  const TASKS_API = 'http://127.0.0.1:5000/api/tasks';

  useEffect(() => { fetchProjectsAndTasks(); }, []);

  const fetchProjectsAndTasks = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([fetch(PROJECTS_API), fetch(TASKS_API)]);
      const projData = await projRes.json();
      const taskData = await taskRes.json();
      setProjects(projData);
      setTasks(taskData);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const formatToDateString = (dayNum) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const getEventsForDate = (dateStr) => {
    const dayProjects = projects.filter(p => p.deadline === dateStr);
    const dayTasks = tasks.filter(t => t.due_date === dateStr);
    return { dayProjects, dayTasks };
  };

  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(<div key={`empty-${i}`} style={{ padding: '12px', minHeight: '100px', background: '#FAFAFA', opacity: 0.4, borderRadius: '8px' }}></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatToDateString(day);
    const { dayProjects, dayTasks } = getEventsForDate(dateStr);
    const totalEvents = dayProjects.length + dayTasks.length;
    const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
    calendarCells.push(
      <div key={day} onClick={() => setSelectedDayEvents({ day, dateStr, dayProjects, dayTasks })}
        style={{ padding: '10px', minHeight: '100px', background: isToday ? '#FEF3C7' : '#fff', border: '1px solid #f3f4f6', borderRadius: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: isToday ? '700' : '500', color: isToday ? '#92400e' : '#374151' }}>{day}</span>
          {totalEvents > 0 && <span style={{ fontSize: '11px', background: '#1f2937', color: '#fff', padding: '2px 6px', borderRadius: '10px' }}>{totalEvents}</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
          {dayProjects.map(p => <div key={`proj-${p.id}`} style={{ fontSize: '11px', background: '#dbeafe', color: '#1e40af', padding: '3px 6px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>&#128193; {p.name}</div>)}
          {dayTasks.map(t => <div key={`task-${t.id}`} style={{ fontSize: '11px', background: t.completed ? '#dcfce7' : '#fef08a', color: t.completed ? '#166534' : '#854d0e', padding: '3px 6px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>&#128204; {t.title}</div>)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Calendar</h1>
          <p>All your project deadlines and task due dates synced in real-time.</p>
        </div>
      </div>
      <div className="content-grid" style={{ gridTemplateColumns: selectedDayEvents ? '2.5fr 1fr' : '1fr', gap: '24px' }}>
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>{monthNames[month]} {year}</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={prevMonth} className="view-all-btn" style={{ display: 'flex', alignItems: 'center' }}><ChevronLeft size={18} /></button>
              <button onClick={() => setCurrentDate(new Date())} className="view-all-btn">Today</button>
              <button onClick={nextMonth} className="view-all-btn" style={{ display: 'flex', alignItems: 'center' }}><ChevronRight size={18} /></button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px', textAlign: 'center', fontWeight: '600', fontSize: '13px', color: '#6b7280' }}>
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>{calendarCells}</div>
        </div>
        {selectedDayEvents && (
          <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: '24px' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px' }}>Schedule for {monthNames[month]} {selectedDayEvents.day}</h3>
              <button onClick={() => setSelectedDayEvents(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>&#10005;</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedDayEvents.dayProjects.length === 0 && selectedDayEvents.dayTasks.length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>No deadlines or tasks scheduled for this day.</p>
              ) : (
                <>
                  {selectedDayEvents.dayProjects.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Project Deadlines</h4>
                      {selectedDayEvents.dayProjects.map(p => (
                        <div key={p.id} style={{ padding: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: '#1e40af', fontSize: '14px' }}><Folder size={16} /> {p.name}</div>
                          <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '4px' }}>Status: {p.status} ({p.progress}%)</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedDayEvents.dayTasks.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Tasks Due</h4>
                      {selectedDayEvents.dayTasks.map(t => (
                        <div key={t.id} style={{ padding: '10px', background: t.completed ? '#f0fdf4' : '#fefce8', border: '1px solid ' + (t.completed ? '#bbf7d0' : '#fef08a'), borderRadius: '8px', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', color: t.completed ? '#166534' : '#854d0e', fontSize: '14px', textDecoration: t.completed ? 'line-through' : 'none' }}>
                            <CheckCircle size={16} /> {t.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Priority: {t.priority}</div>
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
    </div>
  );
}
