import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  urduText = false,
  ...props
}) => {
  const baseClasses =
    "font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${
        variants[variant]
      } ${disabledClasses} ${className} ${urduText ? "font-urdu" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
