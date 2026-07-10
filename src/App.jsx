import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import "./App.css";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Projects from "./pages/admin/Projects";
import Tasks from "./pages/admin/Tasks";
import LearningLog from "./pages/admin/LearningLog";
import Calendar from "./pages/admin/Calendar";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import AdminChat from "./pages/admin/Chat";
import AddIntern from "./pages/admin/AddIntern";

// Intern Pages
import InternDashboard from "./pages/intern/Dashboard";
import MyTasks from "./pages/intern/MyTasks";
import InternLearningLog from "./pages/intern/LearningLog";
import InternCalendar from "./pages/intern/Calendar";
import Chat from "./pages/intern/Chat";
import Profile from "./pages/intern/Profile";

const AdminRoute = () => {
  const role = localStorage.getItem("userRole");
  return role === "admin" ? <Layout /> : <Navigate to="/login" replace />;
};

const InternRoute = () => {
  const role = localStorage.getItem("userRole");
  return role === "intern" ? <Layout /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* ================= ADMIN ================= */}

        <Route
          path="/dashboard"
          element={<AdminRoute />}
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="learning-log" element={<LearningLog />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="add-intern" element={<AddIntern />} />
          <Route path="chat" element={<AdminChat />} />
        </Route>

        {/* ================= INTERN ================= */}

        <Route
          path="/intern-dashboard"
          element={<InternRoute />}
        >
          <Route index element={<InternDashboard />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="learning-log" element={<InternLearningLog />} />
          <Route path="calendar" element={<InternCalendar />} />
          <Route path="chat" element={<Chat />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Invalid Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;