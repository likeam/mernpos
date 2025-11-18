// Urdu font utility functions
export const applyUrduFont = (element) => {
  if (element) {
    element.style.fontFamily = "'Noto Nastaliq Urdu', serif";
    element.style.direction = "rtl";
    element.style.textAlign = "right";
  }
};

export const isUrduText = (text) => {
  const urduRegex = /[\u0600-\u06FF]/;
  return urduRegex.test(text);
};
