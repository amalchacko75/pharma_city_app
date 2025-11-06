import UploadBill from "./UploadBill";
import "./Inventory.css";

export default function UploadBillPage() {
  return (
    <div className="upload-bill-page">
  <div className="upload-bill-container">
    <h1>Upload Bill</h1>
    <p>Upload scanned or digital bills here for processing and tracking.</p>
    <UploadBill />
  </div>
</div>

  );
}
