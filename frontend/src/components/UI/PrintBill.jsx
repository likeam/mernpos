import React, { useRef } from "react";
// import { generateBillHTML } from "../../../../backend/utils/printBill";
import Button from "./Button";
import Modal from "./Modal";

const PrintBill = ({ isOpen, onClose, order }) => {
  const billRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    // const billHTML = generateBillHTML(order);

    // printWindow.document.write(billHTML);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !order) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="بل پرنٹ کریں" size="lg">
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">
              آرڈر نمبر: {order.orderNumber}
            </h3>
            <p className="text-gray-600">
              تاریخ: {new Date(order.orderDate).toLocaleString("ur-PK")}
            </p>
            <p className="text-green-600 text-xl font-bold mt-2">
              کل رقم: Rs. {order.total.toFixed(2)}
            </p>
          </div>
        </div>

        <div
          ref={billRef}
          className="print-bill border-2 border-dashed border-gray-300 p-4"
        >
          {/* Bill Preview */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">گروسری اسٹور</h2>
            <p className="text-sm">مرکزی مارکیٹ، لاہور</p>
            <p className="text-sm">0321-1234567</p>
          </div>

          <div className="border-b border-dashed border-gray-400 mb-4 pb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>آرڈر نمبر:</span>
              <span>{order.orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>تاریخ:</span>
              <span>{new Date(order.orderDate).toLocaleString("ur-PK")}</span>
            </div>
            {order.customerName && (
              <div className="flex justify-between text-sm mb-1">
                <span>گاہک:</span>
                <span>{order.customerName}</span>
              </div>
            )}
          </div>

          <div className="mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-400">
                  <th className="text-right pb-1">پرڈکٹ</th>
                  <th className="text-center pb-1">مقدار</th>
                  <th className="text-center pb-1">قیمت</th>
                  <th className="text-center pb-1">کل</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-dashed border-gray-300"
                  >
                    <td className="py-1 text-right">
                      {item.productNameUrdu || item.productName}
                    </td>
                    <td className="py-1 text-center">{item.quantity}</td>
                    <td className="py-1 text-center">
                      {item.price.toFixed(2)}
                    </td>
                    <td className="py-1 text-center">
                      {item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-dashed border-gray-400 pt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>سب ٹوٹل:</span>
              <span>Rs. {order.subtotal.toFixed(2)}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between text-sm mb-1">
                <span>ٹیکس:</span>
                <span>Rs. {order.tax.toFixed(2)}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between text-sm mb-1">
                <span>ڈسکاؤنٹ:</span>
                <span>Rs. {order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t border-gray-500 mt-2 pt-2">
              <span>کل رقم:</span>
              <span>Rs. {order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>وصولی رقم:</span>
              <span>Rs. {order.cashReceived.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>بدلہ:</span>
              <span>Rs. {order.change.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center mt-5 pt-2 border-t border-dashed border-gray-400">
            <p className="font-bold">شکریہ!</p>
            <p className="text-xs">دوبارہ تشریف لائیے</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 space-x-reverse">
          <Button onClick={handleClose} variant="secondary">
            بند کریں
          </Button>
          <Button onClick={handlePrint} variant="success">
            پرنٹ کریں
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PrintBill;
