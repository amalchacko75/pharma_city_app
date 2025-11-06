import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/auth/Login";
import SuperAdminDashboard from "../pages/super-admin/Dashboard";
import PharmacyDashboard from "../pages/pharmacy-admin/Dashboard";
import DoctorDashboard from "../pages/doctor-admin/Dashboard";
import Chat from "../pages/chat/Chat";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../context/AuthContext";
import AdminSignup from "../pages/auth/Signup";
import InventoryPage from "../pages/pharmacy-admin/InventoryPage"
import UploadBillPage from "../pages/pharmacy-admin/UploadBillPage"
import AddDrugsPage from "../pages/pharmacy-admin/AddDrugPage"

export default function AdminRoutes() {
  const { user } = useAuth();

  // Map backend roles to frontend routes
  const mappedRole =
    user?.role === "pharmacist"
      ? "pharmacy"
      : user?.role === "doctor_admin"
      ? "doctor"
      : user?.role === "super_admin"
      ? "super"
      : user?.role;

  if (!user) {
    return (
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route path="signup" element={<AdminSignup />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    );
  }

  return (
    <AdminLayout>
      <Routes>
        {/* Super Admin */}
        {mappedRole === "super" && (
          <>
            <Route path="super" element={<SuperAdminDashboard />} />
            <Route path="super/chat" element={<Chat />} />
          </>
        )}

        {/* Pharmacy Admin */}
        {mappedRole === "pharmacy" && (
          <>
            <Route path="pharmacy" element={<PharmacyDashboard />} />
            <Route path="pharmacy/inventory" element={<InventoryPage />} />
            <Route path="pharmacy/uploadbill" element={<UploadBillPage />} />
            <Route path="pharmacy/add-drugs" element={<AddDrugsPage />} />
            <Route path="pharmacy/chat" element={<Chat />} />
          </>
        )}

        {/* Doctor Admin */}
        {mappedRole === "doctor" && (
          <>
            <Route path="doctor" element={<DoctorDashboard />} />
            <Route path="doctor/chat" element={<Chat />} />
          </>
        )}

        {/* Default redirect */}
        <Route
          path="*"
          element={<Navigate to={`/admin/${mappedRole}`} replace />}
        />
      </Routes>
    </AdminLayout>
  );
}
