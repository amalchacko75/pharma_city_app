import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../auth/common.css"; // same CSS file

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setrole] = useState("")
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, role, password);
      navigate("/login");
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-container">
          <img src="/logo192.png" alt="App Logo" className="auth-logo" />
          <h2>Create Account</h2>
          <p>Join our admin panel</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Role</label>
          <input
            type="role"
            placeholder="pharmacist/doctor"
            value={role}
            onChange={(e) => setrole(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Sign Up</button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="admin/login">Login</Link>
        </p>

        <footer>© {new Date().getFullYear()} Send2 Admin Panel</footer>
      </div>
    </div>
  );
}
