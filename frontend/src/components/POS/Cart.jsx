import React, { useState } from "react";
import { ordersAPI } from "../../services/api";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import PrintBill from "../UI/PrintBill";
import { formatCurrency, calculateCartTotals } from "../../utils/helpers";

const Cart = ({
  cart,
  onUpdateItem,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [paymentData, setPaymentData] = useState({
    cashReceived: "",
    customerName: "",
    customerPhone: "",
  });
  const [processing, setProcessing] = useState(false);

  const { subtotal, tax, discount, total } = calculateCartTotals(cart);

  const handleQuantityChange = (productId, newQuantity) => {
    onUpdateItem(productId, parseInt(newQuantity));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("کارٹ خالی ہے");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (
      !paymentData.cashReceived ||
      parseFloat(paymentData.cashReceived) < total
    ) {
      alert("براہ کرم درست رقم درج کریں");
      return;
    }

    setProcessing(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        tax,
        discount,
        cashReceived: parseFloat(paymentData.cashReceived),
        customerName: paymentData.customerName || undefined,
        customerPhone: paymentData.customerPhone || undefined,
      };

      const response = await ordersAPI.create(orderData);
      setCurrentOrder(response.data);
      setShowPaymentModal(false);
      setShowBill(true);
      onClearCart();

      // Reset payment data
      setPaymentData({
        cashReceived: "",
        customerName: "",
        customerPhone: "",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("آرڈر بنانے میں خرابی: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const closeBill = () => {
    setShowBill(false);
    setCurrentOrder(null);
  };

  const calculateChange = () => {
    const cashReceived = parseFloat(paymentData.cashReceived) || 0;
    return cashReceived - total;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">کارٹ</h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {cart.map((item) => (
          <div
            key={item.product._id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {item.product.nameUrdu || item.product.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {formatCurrency(item.price)} فی {item.product.unit}
                </p>
              </div>
              <Button
                onClick={() => onRemoveItem(item.product._id)}
                variant="danger"
                className="ml-2"
                size="sm"
              >
                ×
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button
                  onClick={() =>
                    handleQuantityChange(item.product._id, item.quantity - 1)
                  }
                  variant="outline"
                  className="w-8 h-8 p-0 flex items-center justify-center"
                >
                  -
                </Button>

                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.product._id, e.target.value)
                  }
                  className="w-16 text-center border border-gray-300 rounded py-1"
                  min="1"
                />

                <Button
                  onClick={() =>
                    handleQuantityChange(item.product._id, item.quantity + 1)
                  }
                  variant="outline"
                  className="w-8 h-8 p-0 flex items-center justify-center"
                >
                  +
                </Button>
              </div>

              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(item.total)}
              </div>
            </div>
          </div>
        ))}

        {cart.length === 0 && (
          <div className="text-center py-8 text-gray-500">کارٹ خالی ہے</div>
        )}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between">
            <span>سب ٹوٹل:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          {tax > 0 && (
            <div className="flex justify-between">
              <span>ٹیکس:</span>
              <span>{formatCurrency(tax)}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between">
              <span>ڈسکاؤنٹ:</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
            <span>کل رقم:</span>
            <span className="text-green-600">{formatCurrency(total)}</span>
          </div>
        </div>
      )}

      {/* Cart Actions */}
      <div className="mt-6 space-y-3">
        {cart.length > 0 && (
          <>
            <Button
              onClick={handleCheckout}
              variant="success"
              className="w-full"
              urduText={true}
            >
              ادائیگی کریں
            </Button>
            <Button
              onClick={onClearCart}
              variant="danger"
              className="w-full"
              urduText={true}
            >
              کارٹ صاف کریں
            </Button>
          </>
        )}
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="ادائیگی"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-center text-2xl font-bold text-green-600 mb-2">
              کل رقم: {formatCurrency(total)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصولی رقم *
            </label>
            <input
              type="number"
              value={paymentData.cashReceived}
              onChange={(e) =>
                setPaymentData((prev) => ({
                  ...prev,
                  cashReceived: e.target.value,
                }))
              }
              className="input-field"
              placeholder="0.00"
              min={total}
              step="0.01"
            />
          </div>

          {paymentData.cashReceived && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex justify-between text-lg">
                <span>بدلہ:</span>
                <span className="font-bold">
                  {formatCurrency(calculateChange())}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                گاہک کا نام
              </label>
              <input
                type="text"
                value={paymentData.customerName}
                onChange={(e) =>
                  setPaymentData((prev) => ({
                    ...prev,
                    customerName: e.target.value,
                  }))
                }
                className="input-field"
                placeholder="گاہک کا نام درج کریں"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                فون نمبر
              </label>
              <input
                type="tel"
                value={paymentData.customerPhone}
                onChange={(e) =>
                  setPaymentData((prev) => ({
                    ...prev,
                    customerPhone: e.target.value,
                  }))
                }
                className="input-field"
                placeholder="03XX-XXXXXXX"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 space-x-reverse pt-4">
            <Button
              onClick={() => setShowPaymentModal(false)}
              variant="secondary"
            >
              منسوخ کریں
            </Button>
            <Button
              onClick={handlePayment}
              variant="success"
              disabled={
                processing || !paymentData.cashReceived || calculateChange() < 0
              }
            >
              {processing ? "پروسس ہو رہا ہے..." : "ادائیگی مکمل کریں"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bill Print */}
      {currentOrder && (
        <PrintBill isOpen={showBill} onClose={closeBill} order={currentOrder} />
      )}
    </div>
  );
};

export default Cart;
