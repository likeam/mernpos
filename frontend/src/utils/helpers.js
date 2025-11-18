export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ur-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleString("ur-PK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
};

export const calculateCartTotals = (cart) => {
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = 0; // You can add tax calculation logic here
  const discount = 0; // You can add discount calculation logic here
  const total = subtotal + tax - discount;

  return { subtotal, tax, discount, total };
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\+]?[0-9]{10,13}$/;
  return re.test(phone);
};
