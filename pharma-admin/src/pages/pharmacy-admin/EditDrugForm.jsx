import { useState } from "react";
import "./Inventory.css";

export default function EditDrugForm({ drug, onUpdate }) {
  const [formData, setFormData] = useState({ ...drug });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="edit-drug-overlay">
      <div className="edit-drug-modal">
        <h2>Edit Drug</h2>
        <form onSubmit={handleSubmit} className="edit-drug-form">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Drug Name"
          />
          <input
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand"
          />
          <input
            name="unit_price"
            type="number"
            value={formData.unit_price}
            onChange={handleChange}
            placeholder="Unit Price"
          />
          <select
            name="drug_type"
            value={formData.drug_type}
            onChange={handleChange}
            className="custom-select"
          >
            <option value="pain">Pain Relief</option>
            <option value="antibiotic">Antibiotic</option>
            <option value="vitamin">Vitamin</option>
            <option value="other">Other</option>
          </select>

          <label>
            <input
              type="checkbox"
              name="in_stock"
              checked={formData.in_stock}
              onChange={handleChange}
            />
            In Stock
          </label>

          <div className="edit-drug-actions">
            <button type="submit" className="edit-btn">
              Save
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => onUpdate(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
