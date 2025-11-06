import Sidebar from "../../components/Sidebar";
import InventoryList from "../pharmacy-admin/InventoryList";
import UploadBill from "../pharmacy-admin/UploadBill";
import "./Inventory.css";
import "../pharmacy-admin/Dashboard.css";

export default function AddDrugsPage() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar role="pharmacy" />

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="inventory-page">
          <h1>Add / Manage Drugs</h1>
          {/* 🔹 Existing Inventory List */}
          <div className="inventory-section">
            {/* <h2>Existing Drugs in Inventory</h2> */}
            <InventoryList />
          </div>
        </div>
      </div>
    </div>
  );
}
