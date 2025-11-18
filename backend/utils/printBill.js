const generateBillHTML = (order) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleString("ur-PK", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ur">
<head>
    <meta charset="UTF-8">
    <title>بل</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Noto Nastaliq Urdu', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            direction: rtl;
            line-height: 1.6;
            color: #000;
            background: #fff;
            padding: 10px;
            font-size: 14px;
        }
        
        .receipt {
            width: 80mm;
            margin: 0 auto;
            border: 1px solid #000;
            padding: 15px;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px dashed #000;
            padding-bottom: 10px;
        }
        
        .store-name {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .store-address {
            font-size: 14px;
            margin-bottom: 5px;
        }
        
        .order-info {
            margin-bottom: 15px;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        
        .items-table th {
            border-bottom: 1px solid #000;
            padding: 5px 3px;
            text-align: right;
            font-weight: bold;
        }
        
        .items-table td {
            padding: 4px 3px;
            border-bottom: 1px dashed #ccc;
        }
        
        .item-name {
            text-align: right;
            width: 50%;
        }
        
        .item-qty, .item-price, .item-total {
            text-align: center;
            width: 16.66%;
        }
        
        .totals {
            margin-bottom: 15px;
            border-top: 2px dashed #000;
            padding-top: 10px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        
        .total-final {
            font-weight: bold;
            font-size: 16px;
            border-top: 1px solid #000;
            padding-top: 5px;
        }
        
        .payment-info {
            margin-bottom: 15px;
            border-top: 1px dashed #000;
            padding-top: 10px;
        }
        
        .footer {
            text-align: center;
            margin-top: 20px;
            border-top: 2px dashed #000;
            padding-top: 10px;
            font-size: 12px;
        }
        
        .thank-you {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        @media print {
            body {
                padding: 0;
            }
            .receipt {
                border: none;
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <div class="store-name">گروسری اسٹور</div>
            <div class="store-address">مرکزی مارکیٹ، لاہور</div>
            <div class="store-phone">0321-1234567</div>
        </div>
        
        <div class="order-info">
            <div class="info-row">
                <span>آرڈر نمبر:</span>
                <span>${order.orderNumber}</span>
            </div>
            <div class="info-row">
                <span>تاریخ اور وقت:</span>
                <span>${formatDate(order.orderDate)}</span>
            </div>
            ${
              order.customerName
                ? `
            <div class="info-row">
                <span>گاہک کا نام:</span>
                <span>${order.customerName}</span>
            </div>
            `
                : ""
            }
            ${
              order.customerPhone
                ? `
            <div class="info-row">
                <span>فون نمبر:</span>
                <span>${order.customerPhone}</span>
            </div>
            `
                : ""
            }
        </div>
        
        <table class="items-table">
            <thead>
                <tr>
                    <th class="item-name">پرڈکٹ</th>
                    <th class="item-qty">مقدار</th>
                    <th class="item-price">قیمت</th>
                    <th class="item-total">کل</th>
                </tr>
            </thead>
            <tbody>
                ${order.items
                  .map(
                    (item) => `
                <tr>
                    <td class="item-name">${
                      item.productNameUrdu || item.productName
                    }</td>
                    <td class="item-qty">${item.quantity}</td>
                    <td class="item-price">${item.price.toFixed(2)}</td>
                    <td class="item-total">${item.total.toFixed(2)}</td>
                </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
        
        <div class="totals">
            <div class="total-row">
                <span>سب ٹوٹل:</span>
                <span>Rs. ${order.subtotal.toFixed(2)}</span>
            </div>
            ${
              order.tax > 0
                ? `
            <div class="total-row">
                <span>ٹیکس:</span>
                <span>Rs. ${order.tax.toFixed(2)}</span>
            </div>
            `
                : ""
            }
            ${
              order.discount > 0
                ? `
            <div class="total-row">
                <span>ڈسکاؤنٹ:</span>
                <span>Rs. ${order.discount.toFixed(2)}</span>
            </div>
            `
                : ""
            }
            <div class="total-row total-final">
                <span>کل رقم:</span>
                <span>Rs. ${order.total.toFixed(2)}</span>
            </div>
        </div>
        
        <div class="payment-info">
            <div class="info-row">
                <span>ادائیگی کا طریقہ:</span>
                <span>کیش</span>
            </div>
            <div class="info-row">
                <span>وصولی رقم:</span>
                <span>Rs. ${order.cashReceived.toFixed(2)}</span>
            </div>
            <div class="info-row">
                <span>بدلہ:</span>
                <span>Rs. ${order.change.toFixed(2)}</span>
            </div>
        </div>
        
        <div class="footer">
            <div class="thank-you">شکریہ!</div>
            <div>دوبارہ تشریف لائیے</div>
            <div>واپسی کی شرائط لاگو نہیں ہیں</div>
        </div>
    </div>
</body>
</html>
  `;
};

module.exports = { generateBillHTML };
