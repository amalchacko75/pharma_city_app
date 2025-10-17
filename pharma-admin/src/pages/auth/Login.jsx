import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    navigate(`/admin/${role}`);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Admin Login</h2>
        <div className="quick-login">
          <button onClick={() => handleLogin("super")}>Super Admin</button>
          <button onClick={() => handleLogin("pharmacy")}>Pharmacy</button>
          <button onClick={() => handleLogin("doctor")}>Doctor</button>
        </div>
      </div>
    </div>
  );
}
