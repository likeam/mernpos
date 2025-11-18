import React, { useState, useEffect } from "react";
import { ordersAPI } from "../../services/api";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import PrintBill from "../UI/PrintBill";
import { formatCurrency, formatDate } from "../../utils/helpers";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadOrders();
  }, [dateFilter]);

  const loadOrders = async () => {
    try {
      const params = {};
      if (dateFilter.startDate && dateFilter.endDate) {
        params.startDate = dateFilter.startDate;
        params.endDate = dateFilter.endDate;
      }

      const response = await ordersAPI.getAll(params);
      setOrders(response.data);
    } catch (error) {
      console.error("Error loading orders:", error);
      alert("آرڈرز لوڈ کرنے میں خرابی: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTodayOrders = async () => {
    try {
      const response = await ordersAPI.getToday();
      setOrders(response.data);
      setDateFilter({
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error loading today orders:", error);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handlePrintBill = (order) => {
    setSelectedOrder(order);
    setShowBill(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const closeBill = () => {
    setShowBill(false);
    setSelectedOrder(null);
  };

  const getTotalSales = () => {
    return orders.reduce((total, order) => total + order.total, 0);
  };

  const getTotalOrders = () => {
    return orders.length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">لوڈ ہو رہا ہے...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">آرڈرز کی مینیجمنٹ</h2>
        <div className="flex space-x-3 space-x-reverse">
          <Button onClick={loadTodayOrders} variant="outline" size="sm">
            آج کے آرڈرز
          </Button>
          <Button onClick={loadOrders} variant="primary" size="sm">
            تازہ کریں
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="text-blue-600 text-sm font-semibold mb-2">
            کل آرڈرز
          </div>
          <div className="text-3xl font-bold text-blue-700">
            {getTotalOrders()}
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="text-green-600 text-sm font-semibold mb-2">
            کل فروخت
          </div>
          <div className="text-3xl font-bold text-green-700">
            {formatCurrency(getTotalSales())}
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="text-purple-600 text-sm font-semibold mb-2">
            اوسط آرڈر
          </div>
          <div className="text-3xl font-bold text-purple-700">
            {getTotalOrders() > 0
              ? formatCurrency(getTotalSales() / getTotalOrders())
              : formatCurrency(0)}
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            شروع کی تاریخ
          </label>
          <input
            type="date"
            value={dateFilter.startDate}
            onChange={(e) =>
              setDateFilter((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اختتام کی تاریخ
          </label>
          <input
            type="date"
            value={dateFilter.endDate}
            onChange={(e) =>
              setDateFilter((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className="input-field"
          />
        </div>

        <div className="flex items-end">
          <Button onClick={loadOrders} className="w-full">
            فلٹر لگائیں
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="table-header">آرڈر نمبر</th>
              <th className="table-header">تاریخ</th>
              <th className="table-header">گاہک</th>
              <th className="table-header">آئٹمز</th>
              <th className="table-header">کل رقم</th>
              <th className="table-header">عمل</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="table-cell font-mono">{order.orderNumber}</td>
                <td className="table-cell">{formatDate(order.orderDate)}</td>
                <td className="table-cell">
                  {order.customerName || "واک ان"}
                  {order.customerPhone && (
                    <div className="text-sm text-gray-500">
                      {order.customerPhone}
                    </div>
                  )}
                </td>
                <td className="table-cell">{order.items.length} آئٹمز</td>
                <td className="table-cell">
                  <div className="text-green-600 font-semibold">
                    {formatCurrency(order.total)}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      onClick={() => handleViewDetails(order)}
                      variant="outline"
                      size="sm"
                    >
                      تفصیل
                    </Button>
                    <Button
                      onClick={() => handlePrintBill(order)}
                      variant="primary"
                      size="sm"
                    >
                      بل پرنٹ
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            کوئی آرڈر موجود نہیں ہے
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={showOrderDetails}
        onClose={closeOrderDetails}
        title={`آرڈر تفصیل - ${selectedOrder?.orderNumber}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <strong>آرڈر نمبر:</strong> {selectedOrder.orderNumber}
              </div>
              <div>
                <strong>تاریخ:</strong> {formatDate(selectedOrder.orderDate)}
              </div>
              <div>
                <strong>گاہک:</strong> {selectedOrder.customerName || "واک ان"}
              </div>
              <div>
                <strong>فون:</strong> {selectedOrder.customerPhone || "-"}
              </div>
            </div>

            <div className="border rounded-lg">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-right">مصنوعات</th>
                    <th className="py-2 px-4 text-center">مقدار</th>
                    <th className="py-2 px-4 text-center">قیمت</th>
                    <th className="py-2 px-4 text-center">کل</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2 px-4">
                        {item.productNameUrdu || item.productName}
                      </td>
                      <td className="py-2 px-4 text-center">{item.quantity}</td>
                      <td className="py-2 px-4 text-center">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>سب ٹوٹل:</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.tax > 0 && (
                <div className="flex justify-between">
                  <span>ٹیکس:</span>
                  <span>{formatCurrency(selectedOrder.tax)}</span>
                </div>
              )}
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between">
                  <span>ڈسکاؤنٹ:</span>
                  <span>-{formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>کل رقم:</span>
                <span className="text-green-600">
                  {formatCurrency(selectedOrder.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>وصولی رقم:</span>
                <span>{formatCurrency(selectedOrder.cashReceived)}</span>
              </div>
              <div className="flex justify-between">
                <span>بدلہ:</span>
                <span>{formatCurrency(selectedOrder.change)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Bill Print */}
      {selectedOrder && (
        <PrintBill
          isOpen={showBill}
          onClose={closeBill}
          order={selectedOrder}
        />
      )}
    </div>
  );
};

export default OrderManagement;
