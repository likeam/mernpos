import React from "react";

const Header = () => {
  const currentDate = new Date().toLocaleDateString("ur-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-right mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              گروسری POS سسٹم
            </h1>
            <p className="text-blue-100">آف لائن کام کرنے والا پوس سسٹم</p>
          </div>

          <div className="text-center md:text-left">
            <div className="text-lg font-semibold">{currentDate}</div>
            <div className="text-blue-100">آسان اور تیز ترین پوس سسٹم</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
