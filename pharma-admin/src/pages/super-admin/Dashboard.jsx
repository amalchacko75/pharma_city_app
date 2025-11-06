import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

export default function SuperAdminDashboard() {
  const { logout } = useAuth();

  return (
    <div className="dashboard-main">
      <h1>Super Admin Dashboard</h1>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
      <p>Welcome to the Super Admin panel!</p>
    </div>
  );
}
