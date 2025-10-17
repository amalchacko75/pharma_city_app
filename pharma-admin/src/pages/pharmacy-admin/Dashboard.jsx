import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

export default function PharmacyDashboard() {
  const { logout } = useAuth();

  return (
    <div className="dashboard-main">
      <h1>Pharmacy Admin Dashboard</h1>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
      <p>Manage your inventory and orders here.</p>
    </div>
  );
}
