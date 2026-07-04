import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import RoleSelection from "./pages/auth/RoleSelection.jsx";
import DonorDashboard from "./pages/dashboards/DonorDashboard.jsx";
import NgoDashboard from "./pages/dashboards/NgoDashboard.jsx";
import VolunteerDashboard from "./pages/dashboards/VolunteerDashboard.jsx";
import AdminDashboard from "./pages/dashboards/AdminDashboard.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/dashboard/donor" element={<DonorDashboard />} />
      <Route path="/dashboard/ngo" element={<NgoDashboard />} />
      <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
