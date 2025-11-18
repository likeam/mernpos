import React, { useState, useEffect } from "react";
import {
  productsAPI,
  categoriesAPI,
  subcategoriesAPI,
  brandsAPI,
} from "../../services/api";
import Button from "../UI/Button";

const ProductGrid = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedSubcategory, selectedBrand, searchTerm]);

  const loadInitialData = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        categoriesAPI.getAll(),
        brandsAPI.getAll(),
      ]);

      setCategories(categoriesRes.data);
      setBrands(brandsRes.data);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedSubcategory) params.subcategory = selectedSubcategory;
      if (selectedBrand) params.brand = selectedBrand;
      if (searchTerm) params.search = searchTerm;

      const response = await productsAPI.getAll(params);
      setProducts(response.data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const loadSubcategories = async (categoryId) => {
    try {
      const response = await subcategoriesAPI.getByCategory(categoryId);
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error loading subcategories:", error);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubcategory("");

    if (categoryId) {
      loadSubcategories(categoryId);
    } else {
      setSubcategories([]);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedBrand("");
    setSearchTerm("");
    setSubcategories([]);
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        مصنوعات کی فہرست
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            قسم
          </label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="input-field"
          >
            <option value="">تمام اقسام</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.nameUrdu}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ذیلی قسم
          </label>
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="input-field"
            disabled={!selectedCategory}
          >
            <option value="">تمام ذیلی اقسام</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.nameUrdu}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            برانڈ
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="input-field"
          >
            <option value="">تمام برانڈز</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.nameUrdu}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تلاش
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="مصنوعات کا نام یا بارکوڈ تلاش کریں"
              className="input-field flex-1"
            />
            <Button
              onClick={handleClearFilters}
              variant="secondary"
              className="whitespace-nowrap"
            >
              صاف کریں
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-4">
              <div className="text-center mb-3">
                <h3 className="font-semibold text-gray-800 text-lg mb-1">
                  {product.nameUrdu || product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {product.brand?.nameUrdu || product.brand?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {product.category?.nameUrdu}
                  {product.subcategory && ` / ${product.subcategory.nameUrdu}`}
                </p>
              </div>

              <div className="text-center mb-3">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  Rs. {product.price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  اسٹاک: {product.stock} {product.unit}
                </div>
              </div>

              <Button
                onClick={() => onAddToCart(product)}
                variant="success"
                className="w-full"
                disabled={product.stock === 0}
                urduText={true}
              >
                {product.stock === 0 ? "ختم" : "کارٹ میں شامل کریں"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">کوئی مصنوعات نہیں ملی</div>
          <div className="text-gray-400 mt-2">
            فلٹر تبدیل کریں یا نئی مصنوعات شامل کریں
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
