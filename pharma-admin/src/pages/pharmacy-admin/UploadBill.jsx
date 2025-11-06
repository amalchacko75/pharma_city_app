import { useState } from "react";
import api from "../../api/axios";

export default function UploadBill() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [matchedDrugs, setMatchedDrugs] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMessage("");

    try {
      const response = await api.post("/billing/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        setMessage(`✅ ${data.invoice_filename} uploaded successfully!`);
        setMatchedDrugs(data.matched_drugs || []);
      } else {
        setMessage("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      if (error.response?.status === 401) {
        setMessage("Session expired. Please log in again.");
      } else {
        setMessage("❌ Failed to upload. Please try again.");
      }
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  // 🔹 Edit a matched drug (local edit)
  const handleEdit = (id, field, value) => {
    setMatchedDrugs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  // 🔹 Save update to backend
  const handleSave = async (drug) => {
  try {
    // 1️⃣ Create payload with correct backend field names
    let payload = {
      ...drug,
      name: drug.drug_name,  // map frontend key → backend expected key
      drug_id: drug.id,      // rename id → drug_id
    };

    // 2️⃣ Remove unwanted keys
    delete payload.id;
    delete payload.drug_name;

    // 3️⃣ Remove null, empty, or undefined values
    payload = Object.fromEntries(
      Object.entries(payload).filter(
        ([, value]) => value !== null && value !== "" && value !== undefined
      )
    );

    // 4️⃣ Send cleaned payload
    const response = await api.post(`/pharmacy/pharmacy-drugs/`, payload);

    setMessage(`✅ ${payload.name} saved successfully.`);

    // 5️⃣ Remove from matched list after successful save
    setMatchedDrugs((prev) => prev.filter((d) => d.id !== drug.id));
  } catch (error) {
    console.error("Update failed:", error);
    setMessage("❌ Failed to save drug.");
  }
};



  // 🔹 Delete drug
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this drug?")) return;

  try {
    await api.delete(`/pharmacy/pharmacy-drugs/${id}/`);
    setMatchedDrugs((prev) => prev.filter((d) => d.id !== id)); // ✅ remove locally
    setMessage("🗑️ Drug deleted successfully.");
  } catch (error) {
    console.error("Delete failed:", error);
    setMessage("❌ Failed to delete drug.");
  }
};


  return (
    <div className="upload-bill">
      {/* Upload Form */}
      <form onSubmit={handleUpload}>
        <label htmlFor="bill-upload">Select Bill File:</label>
        <input
          id="bill-upload"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Bill"}
        </button>
      </form>

      {message && <p className="upload-message">{message}</p>}

      {/* Matched Drugs Table */}
      {matchedDrugs.length > 0 && (
        <div className="matched-drugs">
          <h3>Matched Drugs from Bill</h3>
          <table className="drug-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actual Rate</th>
                <th>Sell Rate</th>
                <th>Discount %</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {matchedDrugs.map((drug) => (
                <tr key={drug.id}>
                  <td>
                    <input
                      value={drug.drug_name}
                      onChange={(e) =>
                        handleEdit(drug.id, "drug_name", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={drug.actual_rate}
                      onChange={(e) =>
                        handleEdit(drug.id, "actual_rate", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={drug.sell_rate}
                      onChange={(e) =>
                        handleEdit(drug.id, "sell_rate", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={drug.discount_percentage}
                      onChange={(e) =>
                        handleEdit(drug.id, "discount_percentage", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={drug.cgst}
                      onChange={(e) => handleEdit(drug.id, "cgst", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={drug.sgst}
                      onChange={(e) => handleEdit(drug.id, "sgst", e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="save-btn"
                      onClick={() => handleSave(drug)}
                    >
                      Save
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(drug.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
