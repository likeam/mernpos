import React, { useState, useEffect } from "react";
import Header from "./components/Layout/Header";
import ProductGrid from "./components/POS/ProductGrid";
import Cart from "./components/POS/Cart";
import CategoryManagement from "./components/Management/CategoryManagement";
import SubcategoryManagement from "./components/Management/SubcategoryManagement";
import BrandManagement from "./components/Management/BrandManagement";
import ProductManagement from "./components/Management/ProductManagement";
import OrderManagement from "./components/Orders/OrderManagement";
import BillReprint from "./components/Orders/BillReprint";

function App() {
  const [activeTab, setActiveTab] = useState("pos");
  const [cart, setCart] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product._id === product._id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
              }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity: 1,
            price: product.price,
            total: product.price,
          },
        ];
      }
    });
  };

  const updateCartItem = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId
          ? { ...item, quantity, total: quantity * item.price }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product._id !== productId)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.total, 0);
  };

  const tabs = [
    { id: "pos", name: "POS", nameUrdu: "پOS" },
    { id: "categories", name: "Categories", nameUrdu: "اقسام" },
    { id: "subcategories", name: "Subcategories", nameUrdu: "ذیلی اقسام" },
    { id: "brands", name: "Brands", nameUrdu: "برانڈز" },
    { id: "products", name: "Products", nameUrdu: "مصنوعات" },
    { id: "orders", name: "Orders", nameUrdu: "آرڈرز" },
    { id: "reprint", name: "Reprint Bill", nameUrdu: "بل دوبارہ پرنٹ" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "pos":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProductGrid onAddToCart={addToCart} />
            </div>
            <div>
              <Cart
                cart={cart}
                onUpdateItem={updateCartItem}
                onRemoveItem={removeFromCart}
                onClearCart={clearCart}
                onCheckout={() => setActiveTab("pos")}
              />
            </div>
          </div>
        );
      case "categories":
        return <CategoryManagement />;
      case "subcategories":
        return <SubcategoryManagement />;
      case "brands":
        return <BrandManagement />;
      case "products":
        return <ProductManagement />;
      case "orders":
        return <OrderManagement />;
      case "reprint":
        return <BillReprint />;
      default:
        return <ProductGrid onAddToCart={addToCart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Status Bar */}
        <div className="mb-6 flex justify-between items-center">
          <div
            className={`px-4 py-2 rounded-full text-white ${
              isOnline ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {isOnline ? "آن لائن" : "آف لائن"}
          </div>
          <div className="text-lg font-bold">گروسری POS سسٹم</div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 space-x-reverse">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="block">{tab.nameUrdu}</span>
                <span className="block text-xs text-gray-400">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
