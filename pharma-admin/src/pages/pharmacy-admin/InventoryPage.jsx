import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";
import "./Inventory.css";
import "../pharmacy-admin/Dashboard.css";

export default function InventoryPage() {
  const [drugs, setDrugs] = useState([]);
  const [masterDrugs, setMasterDrugs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingDrugId, setEditingDrugId] = useState(null);
  const [newDrug, setNewDrug] = useState({
    drug_id: "",
    brand: "",
    strength: "",
    actual_rate: "",
    sell_rate: "",
    discount_percentage: "",
  });

  // 🔹 Fetch pharmacy drugs
  const fetchPharmacyDrugs = async (query = "") => {
    setLoading(true);
    try {
      const response = await api.get("/pharmacy/pharmacy-drugs/", {
        params: query ? { search: query } : {},
      });
      setDrugs(response.data || []);
      setMessage("");
    } catch (error) {
      console.error("Failed to fetch pharmacy drugs:", error);
      setMessage("❌ Unable to fetch pharmacy drugs.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch master drugs for dropdown
  const fetchMasterDrugs = async () => {
    try {
      const response = await api.get("/pharmacy/drugs/");
      setMasterDrugs(response.data || []);
    } catch (error) {
      console.error("Failed to fetch master drugs:", error);
    }
  };

  useEffect(() => {
    fetchPharmacyDrugs();
    fetchMasterDrugs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPharmacyDrugs(search.trim());
  };

  // 🔹 Handle local edit
  const handleEditChange = (id, field, value) => {
    setDrugs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  // 🔹 Save edited row
  const handleSave = async (drug) => {
    try {
      setSaving(true);
      const payload = {
        ...drug,
        name: drug.drug_name,
        drug_id: drug.id,
      };
      delete payload.id;
      delete payload.drug_name;

      const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(
          ([, value]) => value !== null && value !== "" && value !== undefined
        )
      );

      await api.put(`/pharmacy/pharmacy-drugs/${drug.drug_id || drug.id}/`, cleanedPayload);
      setMessage(`✅ ${drug.drug_name} updated successfully.`);
      setEditingDrugId(null);
    } catch (error) {
      console.error("Update failed:", error);
      setMessage("❌ Failed to update drug.");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Delete drug
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this drug?")) return;
    try {
      await api.delete(`/pharmacy/pharmacy-drugs/${id}/`);
      setDrugs((prev) => prev.filter((d) => d.id !== id));
      setMessage("🗑️ Drug deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage("❌ Failed to delete drug.");
    }
  };

  // 🔹 Add new drug
  const handleAdd = async () => {
    if (!newDrug.drug_id) {
      setMessage("⚠️ Please select a drug before adding.");
      return;
    }

    try {
      setSaving(true);
      const payload = Object.fromEntries(
        Object.entries(newDrug).filter(
          ([, value]) => value !== null && value !== "" && value !== undefined
        )
      );

      const response = await api.post("/pharmacy/pharmacy-drugs/", payload);
      setMessage(`✅ Drug added successfully!`);
      setDrugs((prev) => [response.data, ...prev]);
      setNewDrug({
        drug_id: "",
        brand: "",
        strength: "",
        actual_rate: "",
        sell_rate: "",
        discount_percentage: "",
      });
      setAdding(false);
    } catch (error) {
      console.error("Add failed:", error);
      setMessage("❌ Failed to add new drug.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="pharmacy" />

      <div className="dashboard-main">
        <div className="drug-list-section">
          <h2>Pharmacy Drugs</h2>

          <div className="drug-header-actions">
            <form onSubmit={handleSearch} className="drug-search-form">
              <input
                type="text"
                placeholder="Search drugs by name, brand, or strength..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>

            <button
              className="add-btn"
              onClick={() => setAdding((prev) => !prev)}
            >
              {adding ? "Cancel" : "+ Add New Drug"}
            </button>
          </div>

          {message && <p className="status-message">{message}</p>}

          {loading ? (
            <p>Loading drugs...</p>
          ) : drugs.length === 0 ? (
            <p>No drugs found.</p>
          ) : (
            <table className="drug-list-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Strength</th>
                  <th>Actual Rate</th>
                  <th>Sell Rate</th>
                  <th>Discount %</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* ➕ New Drug Row */}
                {adding && (
                  <tr className="new-drug-row">
                    <td>
                      <select
                        value={newDrug.drug_id}
                        onChange={(e) =>
                          setNewDrug({ ...newDrug, drug_id: e.target.value })
                        }
                      >
                        <option value="">-- Select Drug --</option>
                        {masterDrugs.map((mdrug) => (
                          <option key={mdrug.id} value={mdrug.id}>
                            {mdrug.name} ({mdrug.formulation || "N/A"})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        value={newDrug.brand}
                        onChange={(e) =>
                          setNewDrug({ ...newDrug, brand: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={newDrug.strength}
                        onChange={(e) =>
                          setNewDrug({ ...newDrug, strength: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={newDrug.actual_rate}
                        onChange={(e) =>
                          setNewDrug({
                            ...newDrug,
                            actual_rate: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={newDrug.sell_rate}
                        onChange={(e) =>
                          setNewDrug({
                            ...newDrug,
                            sell_rate: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={newDrug.discount_percentage}
                        onChange={(e) =>
                          setNewDrug({
                            ...newDrug,
                            discount_percentage: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="save-btn"
                        disabled={saving}
                        onClick={handleAdd}
                      >
                        {saving ? "Saving..." : "Add"}
                      </button>
                    </td>
                  </tr>
                )}

                {/* ✅ Existing Drugs */}
                {drugs.map((drug) => {
                  const isEditing = editingDrugId === drug.id;
                  return (
                    <tr key={drug.id}>
                      <td>{drug.drug_name}</td>
                      <td>
                        {isEditing ? (
                          <input
                            value={drug.brand || ""}
                            onChange={(e) =>
                              handleEditChange(drug.id, "brand", e.target.value)
                            }
                          />
                        ) : (
                          drug.brand || "-"
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            value={drug.strength || ""}
                            onChange={(e) =>
                              handleEditChange(drug.id, "strength", e.target.value)
                            }
                          />
                        ) : (
                          drug.strength || "-"
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            value={drug.actual_rate}
                            onChange={(e) =>
                              handleEditChange(drug.id, "actual_rate", e.target.value)
                            }
                          />
                        ) : (
                          drug.actual_rate
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            value={drug.sell_rate}
                            onChange={(e) =>
                              handleEditChange(drug.id, "sell_rate", e.target.value)
                            }
                          />
                        ) : (
                          drug.sell_rate
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            value={drug.discount_percentage}
                            onChange={(e) =>
                              handleEditChange(
                                drug.id,
                                "discount_percentage",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          drug.discount_percentage
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <>
                            <button
                              className="save-btn"
                              disabled={saving}
                              onClick={() => handleSave(drug)}
                            >
                              💾 Save
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={() => setEditingDrugId(null)}
                            >
                              ❌ Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="icon-btn edit"
                              onClick={() => setEditingDrugId(drug.id)}
                            >
                              ✏️
                            </button>
                            <button
                              className="icon-btn delete"
                              onClick={() => handleDelete(drug.id)}
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
