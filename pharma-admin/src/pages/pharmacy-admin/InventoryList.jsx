import { useEffect, useState } from "react";
import api from "../../api/axios";
import AddDrugForm from "./AddDrugForm";
import EditDrugForm from "./EditDrugForm";
import "./Inventory.css";

export default function InventoryList() {
  const [drugs, setDrugs] = useState([]);
  const [editingDrug, setEditingDrug] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Fetch all drugs when page loads
  useEffect(() => {
    const fetchDrugs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/pharmacy/drugs/");
        setDrugs(response.data);
      } catch (err) {
        console.error("Error fetching drugs:", err);
        setError("Failed to load drugs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrugs();
  }, []);

  // 🔹 Add a new drug (already handled in AddDrugForm)
  const handleAdd = (newDrug) => {
    setDrugs((prev) => [...prev, newDrug]);
  };

  // 🔹 Delete a drug
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this drug?")) return;

    try {
      await api.delete(`/pharmacy/drugs/${id}/`);
      setDrugs(drugs.filter((drug) => drug.id !== id));
    } catch (err) {
      console.error("Error deleting drug:", err);
      alert("Failed to delete drug. Please try again.");
    }
  };

  // 🔹 Update a drug after editing
  const handleUpdate = async (updatedDrug) => {
    try {
      const response = await api.put(
        `/pharmacy/drugs/${updatedDrug.id}/`,
        updatedDrug
      );
      const newData = response.data;

      setDrugs((prev) =>
        prev.map((d) => (d.id === newData.id ? newData : d))
      );
      setEditingDrug(null);
    } catch (err) {
      console.error("Error updating drug:", err);
      alert("Failed to update drug. Please try again.");
    }
  };

  return (
    <div className="inventory-container">
      <AddDrugForm onAdd={handleAdd} />

      {loading ? (
        <p>Loading drugs...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <table className="drug-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Unit Price</th>
              <th>Drug Type</th>
              <th>In Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drugs.length > 0 ? (
              drugs.map((drug) => (
                <tr key={drug.id}>
                  <td>{drug.name}</td>
                  <td>{drug.brand}</td>
                  <td>₹{drug.unit_price}</td>
                  <td>{drug.drug_type}</td>
                  <td>{drug.in_stock ? "✅" : "❌"}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => setEditingDrug(drug)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(drug.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No drugs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editingDrug && (
        <EditDrugForm
          drug={editingDrug}
          onUpdate={(updatedDrug) => {
            if (updatedDrug) handleUpdate(updatedDrug);
            else setEditingDrug(null);
          }}
        />
      )}
    </div>
  );
}
