import { useState, useEffect, useRef } from 'react';
import { FileText, Download, CheckCircle, Clock, AlertTriangle, Layers, BarChart3, PieChart, ListTodo } from 'lucide-react';
import { Chart } from "react-google-charts";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef(null);

  const REPORTS_API_URL = 'http://127.0.0.1:5000/api/reports';

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch(REPORTS_API_URL);
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    setExporting(true);
    try {
      const input = reportRef.current;
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`InternTrack_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 40, height: 40, border: '4px solid #e5e7eb', borderTopColor: '#111827', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#6b7280' }}>Loading reports...</p>
        </div>
      </div>
    );
  }

  const d = reportData || {
    total_tasks: 0, completed_tasks: 0, pending_tasks: 0,
    completion_rate: 0, total_projects: 0, active_projects: 0,
    completed_projects: 0, priority_breakdown: { high: 0, medium: 0, low: 0 },
    recent_tasks: []
  };

  // Chart data
  const statusPieData = [
    ["Status", "Count"],
    ["Completed", d.completed_tasks],
    ["Pending", d.pending_tasks],
  ];

  const priorityBarData = [
    ["Priority", "Tasks", { role: "style" }],
    ["High", d.priority_breakdown.high, "#ef4444"],
    ["Medium", d.priority_breakdown.medium, "#f59e0b"],
    ["Low", d.priority_breakdown.low, "#10b981"],
  ];

  const pieOptions = {
    is3D: true,
    backgroundColor: 'transparent',
    colors: ['#10b981', '#f59e0b'],
    legend: { position: 'bottom', textStyle: { color: '#6b7280', fontSize: 12 } },
    chartArea: { width: '90%', height: '75%' },
  };

  const barOptions = {
    backgroundColor: 'transparent',
    colors: ['#8b5cf6'],
    legend: { position: 'none' },
    chartArea: { width: '80%', height: '70%' },
    hAxis: { textStyle: { color: '#6b7280', fontSize: 12 } },
    vAxis: { textStyle: { color: '#6b7280', fontSize: 11 }, minValue: 0 },
    bar: { groupWidth: '50%' },
  };

  return (
    <div>
      <div className="welcome-section">
        <div className="welcome-text">
          <h1 style={{ fontSize: '18px' }}>Analytics & Reports</h1>
          <p style={{ fontSize: '12px' }}>Real-time insights based on your tasks and projects data.</p>
        </div>
        <button 
          className="submit-btn" 
          style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', fontSize: '13px' }}
          onClick={exportPDF}
          disabled={exporting}
        >
          <Download size={16} /> 
          {exporting ? 'Generating...' : 'Export PDF'}
        </button>
      </div>

      <div ref={reportRef} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Stats Cards */}
        <div className="stats-grid" style={{ gap: '8px' }}>
          <div className="stat-card" style={{ padding: '10px', gap: '8px' }}>
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#dbeafe', width: '32px', height: '32px' }}>
              <ListTodo size={18} color="#3b82f6" />
            </div>
            <div className="stat-info">
              <p style={{ fontSize: '10px' }}>Total Tasks</p>
              <h3 style={{ fontSize: '16px' }}>{d.total_tasks}</h3>
            </div>
          </div>
          <div className="stat-card" style={{ padding: '10px', gap: '8px' }}>
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#d1fae5', width: '32px', height: '32px' }}>
              <CheckCircle size={18} color="#10b981" />
            </div>
            <div className="stat-info">
              <p style={{ fontSize: '10px' }}>Completed</p>
              <h3 style={{ fontSize: '16px' }}>{d.completed_tasks}</h3>
            </div>
          </div>
          <div className="stat-card" style={{ padding: '10px', gap: '8px' }}>
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fef3c7', width: '32px', height: '32px' }}>
              <Clock size={18} color="#f59e0b" />
            </div>
            <div className="stat-info">
              <p style={{ fontSize: '10px' }}>Pending</p>
              <h3 style={{ fontSize: '16px' }}>{d.pending_tasks}</h3>
            </div>
          </div>
          <div className="stat-card" style={{ padding: '10px', gap: '8px' }}>
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#ede9fe', width: '32px', height: '32px' }}>
              <BarChart3 size={18} color="#8b5cf6" />
            </div>
            <div className="stat-info">
              <p style={{ fontSize: '10px' }}>Completion Rate</p>
              <h3 style={{ fontSize: '16px' }}>{d.completion_rate}%</h3>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="content-grid" style={{ gridTemplateColumns: '1fr', gap: '10px' }}>
          {/* Task Status Pie Chart */}
          <div className="card" style={{ padding: '10px' }}>
            <div className="card-header" style={{ marginBottom: '8px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                <PieChart size={16} color="#10b981" /> Task Status Overview
              </h3>
            </div>
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'center', minHeight: '180px' }}>
              {d.total_tasks === 0 ? (
                <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '12px', alignSelf: 'center' }}>No tasks yet. Create tasks to see the chart.</p>
              ) : (
                <Chart chartType="PieChart" data={statusPieData} options={pieOptions} width={"100%"} height={"180px"} />
              )}
            </div>
          </div>

          {/* Priority Bar Chart */}
          <div className="card" style={{ padding: '10px' }}>
            <div className="card-header" style={{ marginBottom: '8px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                <BarChart3 size={16} color="#8b5cf6" /> Tasks by Priority
              </h3>
            </div>
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'center', minHeight: '180px' }}>
              {d.total_tasks === 0 ? (
                <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '12px', alignSelf: 'center' }}>No tasks yet. Create tasks to see the chart.</p>
              ) : (
                <Chart chartType="ColumnChart" data={priorityBarData} options={barOptions} width={"100%"} height={"180px"} />
              )}
            </div>
          </div>
        </div>

        {/* Projects & Priority Summary */}
        <div className="content-grid" style={{ gridTemplateColumns: '1fr', gap: '10px' }}>
          <div className="card" style={{ padding: '12px' }}>
            <div className="card-header" style={{ marginBottom: '8px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                <Layers size={16} color="#3b82f6" /> Projects Summary
              </h3>
            </div>
            <div style={{ padding: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ color: '#6b7280', fontSize: '12px' }}>Total Projects</span>
                <strong style={{ fontSize: '14px' }}>{d.total_projects}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ color: '#6b7280', fontSize: '12px' }}>Active Projects</span>
                <strong style={{ color: '#f59e0b', fontSize: '14px' }}>{d.active_projects}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: '#6b7280', fontSize: '12px' }}>Completed Projects</span>
                <strong style={{ color: '#10b981', fontSize: '14px' }}>{d.completed_projects}</strong>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '12px' }}>
            <div className="card-header" style={{ marginBottom: '8px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                <AlertTriangle size={16} color="#ef4444" /> Priority Breakdown
              </h3>
            </div>
            <div style={{ padding: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block', flexShrink: 0 }}></span>
                  <span style={{ flex: 1 }}>High Priority</span>
                </span>
                <strong style={{ color: '#ef4444', fontSize: '14px' }}>{d.priority_breakdown.high}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block', flexShrink: 0 }}></span>
                  <span style={{ flex: 1 }}>Medium Priority</span>
                </span>
                <strong style={{ color: '#f59e0b', fontSize: '14px' }}>{d.priority_breakdown.medium}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', flexShrink: 0 }}></span>
                  <span style={{ flex: 1 }}>Low Priority</span>
                </span>
                <strong style={{ color: '#10b981', fontSize: '14px' }}>{d.priority_breakdown.low}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks Table */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#6b7280" /> Recent Tasks
            </h3>
          </div>
          <table className="task-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {d.recent_tasks.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-state">No tasks found. Create tasks to see them here.</td>
                </tr>
              )}
              {d.recent_tasks.slice().reverse().map(task => (
                <tr key={task.id}>
                  <td className="task-name-cell"><span>{task.title}</span></td>
                  <td>
                    <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                  </td>
                  <td className="date-cell">{task.due_date}</td>
                  <td>
                    <span className={`status-badge ${task.status === 'Completed' ? 'status-active' : 'status-pending'}`}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance Summary Card */}
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)' }}>
          <FileText size={48} color="#10b981" style={{ marginBottom: '16px' }} />
          <h2 style={{ color: '#065f46', marginBottom: '8px' }}>Weekly Performance Summary</h2>
          <p style={{ color: '#047857', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            {d.completion_rate >= 80 
              ? `Excellent work! You have completed ${d.completion_rate}% of your tasks. Keep up the great performance! 🎉`
              : d.completion_rate >= 50
                ? `Good progress! You have completed ${d.completion_rate}% of your tasks. Keep pushing forward! 💪`
                : `You have completed ${d.completion_rate}% of your tasks. Focus on completing pending tasks to improve your rate. 📋`
            }
          </p>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ color: '#10b981', fontSize: '28px' }}>{d.completed_tasks}</h3>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>Tasks Done</p>
            </div>
            <div>
              <h3 style={{ color: '#f59e0b', fontSize: '28px' }}>{d.pending_tasks}</h3>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>Remaining</p>
            </div>
            <div>
              <h3 style={{ color: '#8b5cf6', fontSize: '28px' }}>{d.total_projects}</h3>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>Projects</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}