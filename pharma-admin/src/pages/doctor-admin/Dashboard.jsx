import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

export default function DoctorDashboard() {
  const { logout } = useAuth();

  return (
    <div className="dashboard-main">
      <h1>Doctor Admin Dashboard</h1>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
      <p>Manage your appointments and profile here.</p>
    </div>
  );
}
