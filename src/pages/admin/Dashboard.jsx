import { useState, useEffect } from 'react';
import { Calendar, Layers, CheckCircle, Clock, Crown, Trash2, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chart } from "react-google-charts";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();
  const TASKS_API_URL = 'http://127.0.0.1:5000/api/tasks';
  const PROJECTS_API_URL = 'http://127.0.0.1:5000/api/projects';

  useEffect(() => { 
    fetchTasks(); 
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(TASKS_API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(PROJECTS_API_URL);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    await fetch(`${TASKS_API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !currentStatus })
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${TASKS_API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Dashboard Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length;

  // Google 3D Pie Chart Data & Settings
  const pieData = [
    ["Task Status", "Count"],
    ["Completed", completedTasks],
    ["Pending", pendingTasks],
  ];

  const pieOptions = {
    is3D: true,
    backgroundColor: 'transparent',
    colors: ['#10b981', '#f59e0b'], // Green for completed, Orange for pending
    legend: { position: 'bottom', textStyle: { color: '#6b7280', fontSize: 13 } },
    chartArea: { width: '90%', height: '80%' },
  };

  return (
    <div>
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>{getGreeting()}, Admin! 👋</h1>
          <p>Here's what's happening with your tasks and projects today.</p>
        </div>
        <div className="date-picker">
          <Calendar size={16} /> Today, {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper"><Layers size={20} /></div>
          <div className="stat-info"><p>Active Projects</p><h3>{activeProjectsCount}</h3></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper"><CheckCircle size={20} /></div>
          <div className="stat-info"><p>Completed Tasks</p><h3>{completedTasks}</h3></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper"><Clock size={20} /></div>
          <div className="stat-info"><p>Pending Tasks</p><h3>{pendingTasks}</h3></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper"><Crown size={20} /></div>
          <div className="stat-info"><p>Total Tasks</p><h3>{totalTasks}</h3></div>
        </div>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '1fr', gap: '12px' }}>
        
        {/* RECENT TASKS WIDGET */}
          <div className="card task-list-card">
            <div className="card-header">
              <h3>Recent Tasks</h3>
              <button className="view-all-btn" onClick={() => navigate('/dashboard/tasks')}>View All</button>
            </div>
          <table className="task-table">
            <thead>
              <tr><th>Task</th><th>Priority</th><th>Due</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {tasks.length === 0 && (
                <tr><td colSpan="5" className="empty-state">No tasks yet. Go to Tasks menu to create one!</td></tr>
              )}
                {tasks.slice(0, 5).map(task => (
                  <tr key={task.id} className={task.completed ? 'row-completed' : ''}>
                    <td data-label="Task" className="task-name-cell">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => toggleComplete(task.id, task.completed)}
                        className="custom-checkbox"
                      />
                      <span>{task.title}</span>
                    </td>
                    <td data-label="Priority">
                      <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                    </td>
                    <td data-label="Due" className="date-cell">{task.due_date || 'No Date'}</td>
                    <td data-label="Status">
                      <span className={`status-badge ${task.completed ? 'status-active' : 'status-pending'}`}>
                        {task.completed ? 'Completed' : 'Active'}
                      </span>
                    </td>
                    <td data-label="">
                      <button className="delete-btn" onClick={() => deleteTask(task.id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* 3D PIE CHART WIDGET */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChart size={18} color="#8b5cf6" /> Task Completion
            </h3>
          </div>
          <div style={{ padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '180px' }}>
            {totalTasks === 0 ? (
              <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '12px' }}>Add tasks to generate overview!</p>
            ) : (
              <Chart
                chartType="PieChart"
                data={pieData}
                options={pieOptions}
                width={"100%"}
                height={"180px"}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}