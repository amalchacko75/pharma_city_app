import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ role }) {
  // Normalize backend role to match sidebar keys
  const normalizedRole =
    role === "pharmacist"
      ? "pharmacy"
      : role === "super_admin"
      ? "super"
      : role === "doctor_admin"
      ? "doctor"
      : role;

  const links = {
    super: [
      { name: "Dashboard", path: "/admin/super", end: true },
      { name: "Manage Users", path: "/admin/super/manage-users" },
      { name: "Settings", path: "/admin/super/settings" },
      { name: "Chat", path: "/admin/super/chat" },
    ],
    pharmacy: [
      { name: "Dashboard", path: "/admin/pharmacy", end: true },
      { name: "Inventory", path: "/admin/pharmacy/inventory" },
      { name: "Upload Bill", path: "/admin/pharmacy/uploadbill" },
      { name: "Add Drugs", path: "/admin/pharmacy/add-drugs" },
      { name: "Chat", path: "/admin/pharmacy/chat" },
    ],
    doctor: [
      { name: "Dashboard", path: "/admin/doctor", end: true },
      { name: "Appointments", path: "/admin/doctor/appointments" },
      { name: "Profile", path: "/admin/doctor/profile" },
      { name: "Chat", path: "/admin/doctor/chat" },
    ],
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">{normalizedRole?.toUpperCase()} PANEL</h2>
      <nav>
        {links[normalizedRole]?.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.end || false} // <-- use end for exact matching
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
