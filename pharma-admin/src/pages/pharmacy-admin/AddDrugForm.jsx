import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ For redirect
import api from "../../api/axios";

export default function AddDrugForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    formulation: "",
    strength: "",
    unit_price: "0.00",
    drug_type: "pain",
    in_stock: true,
  });

  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ redirect if token expired

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    try {
      const response = await api.post("/pharmacy/drugs/", formData);

      // ✅ Success block
      if (response.status === 201 || response.status === 200) {
        const newDrug = response.data;
        onAdd(newDrug);

        setFormData({
          name: "",
          brand: "",
          formulation: "",
          strength: "",
          unit_price: "0.00",
          drug_type: "pain",
          in_stock: true,
        });
        setFormError(null);
      } else {
        setFormError("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error adding drug:", error);

      // ✅ Handle Unauthorized (token expired / invalid)
      if (error.response?.status === 401) {
        setFormError("Session expired. Redirecting to login...");
        setTimeout(() => navigate("/admin/login"), 1500); // redirect after short delay
        return;
      }

      // ✅ Handle validation or backend errors safely
      if (error.response?.data) {
        const data = error.response.data;
        let messages = [];

        // Handle detail (common with 401 or 403)
        if (data.detail && typeof data.detail === "string") {
          messages.push(data.detail);
        }

        // Handle non_field_errors
        if (data.non_field_errors) {
          if (Array.isArray(data.non_field_errors)) {
            messages.push(data.non_field_errors.join(", "));
          } else {
            messages.push(data.non_field_errors);
          }
        }

        // Handle field-level errors safely
        Object.entries(data).forEach(([field, errors]) => {
          if (field === "non_field_errors" || field === "detail") return;
          if (Array.isArray(errors)) {
            messages.push(`${field}: ${errors.join(", ")}`);
          } else if (typeof errors === "string") {
            messages.push(`${field}: ${errors}`);
          } else if (errors && typeof errors === "object") {
            messages.push(`${field}: ${JSON.stringify(errors)}`);
          }
        });

        setFormError(messages.length ? messages.join("\n") : "Validation error.");
      } else {
        setFormError("Failed to add drug. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-drug-form">
      <input
        name="name"
        placeholder="Drug Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="brand"
        placeholder="Brand"
        value={formData.brand}
        onChange={handleChange}
      />
      <input
        name="formulation"
        placeholder="Formulation"
        value={formData.formulation || ""}
        onChange={handleChange}
      />
      <input
        name="strength"
        placeholder="Strength"
        value={formData.strength || ""}
        onChange={handleChange}
      />
      <input
        name="unit_price"
        type="number"
        step="0.01"
        placeholder="Unit Price"
        value={formData.unit_price}
        onChange={handleChange}
        required
      />

      <select
        name="drug_type"
        value={formData.drug_type}
        onChange={handleChange}
        required
        className="custom-select"
      >
        <option value="pain">Pain Relief</option>
        <option value="antibiotic">Antibiotic</option>
        <option value="vitamin">Vitamin</option>
        <option value="other">Other</option>
      </select>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="in_stock"
          checked={formData.in_stock}
          onChange={handleChange}
        />
        In Stock
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Drug"}
      </button>

      {formError && <p className="error-text">{formError}</p>}
    </form>
  );
}
