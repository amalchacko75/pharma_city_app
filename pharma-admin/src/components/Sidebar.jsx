import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ role }) {
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
      { name: "Orders", path: "/admin/pharmacy/orders" },
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
      <h2 className="sidebar-title">{role.toUpperCase()} PANEL</h2>
      <nav>
        {links[role]?.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.end}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
