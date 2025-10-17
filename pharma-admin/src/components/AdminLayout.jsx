import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar role={user.role} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}
