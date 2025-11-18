import React, { useState } from "react";
import { ordersAPI } from "../../services/api";
import Button from "../UI/Button";
import PrintBill from "../UI/PrintBill";

const BillReprint = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!orderNumber.trim()) {
      setError("براہ کرم آرڈر نمبر درج کریں");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await ordersAPI.getByNumber(orderNumber.trim());
      setOrder(response.data);
      setShowBill(true);
    } catch (error) {
      setError("آرڈر نہیں ملا۔ براہ کرم آرڈر نمبر چیک کریں");
    } finally {
      setLoading(false);
    }
  };

  const closeBill = () => {
    setShowBill(false);
    setOrder(null);
    setOrderNumber("");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        بل دوبارہ پرنٹ کریں
      </h2>

      <div className="max-w-md mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              آرڈر نمبر درج کریں
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="مثال: ORD-1693576800000-123"
              className="input-field"
            />
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? "تلاش ہو رہی ہے..." : "بل تلاش کریں"}
          </Button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          <p>آرڈر نمبر کی مثال: ORD-1693576800000-123</p>
          <p className="text-sm mt-2">آرڈر نمبر بل کے اوپر درج ہوتا ہے</p>
        </div>
      </div>

      {/* Bill Print */}
      {order && (
        <PrintBill isOpen={showBill} onClose={closeBill} order={order} />
      )}
    </div>
  );
};

export default BillReprint;
