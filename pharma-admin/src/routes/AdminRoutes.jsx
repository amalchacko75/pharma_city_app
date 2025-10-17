import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import AdminLogin from "../pages/auth/Login";
import SuperAdminDashboard from "../pages/super-admin/Dashboard";
import PharmacyDashboard from "../pages/pharmacy-admin/Dashboard";
import DoctorDashboard from "../pages/doctor-admin/Dashboard";
import Chat from "../pages/chat/Chat";
import AdminLayout from "../components/AdminLayout";

export default function AdminRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Login */}
      {!user && <Route path="login" element={<AdminLogin />} />}

      {/* Super Admin */}
      {user?.role === "super" && (
        <>
          <Route
            path="super"
            element={
              <AdminLayout>
                <SuperAdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="super/chat"
            element={
              <AdminLayout>
                <Chat />
              </AdminLayout>
            }
          />
        </>
      )}

      {/* Pharmacy Admin */}
      {user?.role === "pharmacy" && (
        <>
          <Route
            path="pharmacy"
            element={
              <AdminLayout>
                <PharmacyDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="pharmacy/chat"
            element={
              <AdminLayout>
                <Chat />
              </AdminLayout>
            }
          />
        </>
      )}

      {/* Doctor Admin */}
      {user?.role === "doctor" && (
        <>
          <Route
            path="doctor"
            element={
              <AdminLayout>
                <DoctorDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="doctor/chat"
            element={
              <AdminLayout>
                <Chat />
              </AdminLayout>
            }
          />
        </>
      )}

      {/* Catch-all */}
      <Route
        path="*"
        element={
          <Navigate
            to={user ? `/admin/${user.role}` : "/admin/login"}
            replace
          />
        }
      />
    </Routes>
  );
}
