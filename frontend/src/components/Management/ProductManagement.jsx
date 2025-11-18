import React, { useState, useEffect } from "react";
import {
  productsAPI,
  categoriesAPI,
  subcategoriesAPI,
  brandsAPI,
} from "../../services/api";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import { UNITS } from "../../utils/constants";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nameUrdu: "",
    barcode: "",
    price: "",
    costPrice: "",
    stock: "",
    category: "",
    subcategory: "",
    brand: "",
    unit: "pcs",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
        brandsAPI.getAll(),
      ]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setBrands(brandsRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("ڈیٹا لوڈ کرنے میں خرابی: " + error.message);
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        costPrice: formData.costPrice
          ? parseFloat(formData.costPrice)
          : undefined,
        stock: parseInt(formData.stock),
        subcategory: formData.subcategory || undefined,
        brand: formData.brand || undefined,
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct._id, submitData);
      } else {
        await productsAPI.create(submitData);
      }

      await loadData();
      handleCloseModal();
    } catch (error) {
      alert("محفوظ کرنے میں خرابی: " + error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameUrdu: product.nameUrdu,
      barcode: product.barcode || "",
      price: product.price.toString(),
      costPrice: product.costPrice?.toString() || "",
      stock: product.stock.toString(),
      category: product.category._id,
      subcategory: product.subcategory?._id || "",
      brand: product.brand?._id || "",
      unit: product.unit,
    });

    if (product.category._id) {
      loadSubcategories(product.category._id);
    }

    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("کیا آپ واقعی اس مصنوعات کو حذف کرنا چاہتے ہیں؟")) {
      try {
        await productsAPI.delete(productId);
        await loadData();
      } catch (error) {
        alert("حذف کرنے میں خرابی: " + error.message);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      nameUrdu: "",
      barcode: "",
      price: "",
      costPrice: "",
      stock: "",
      category: "",
      subcategory: "",
      brand: "",
      unit: "pcs",
    });
    setSubcategories([]);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      nameUrdu: "",
      barcode: "",
      price: "",
      costPrice: "",
      stock: "",
      category: "",
      subcategory: "",
      brand: "",
      unit: "pcs",
    });
    setSubcategories([]);
    setShowModal(true);
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setFormData((prev) => ({ ...prev, category: categoryId, subcategory: "" }));

    if (categoryId) {
      loadSubcategories(categoryId);
    } else {
      setSubcategories([]);
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      await productsAPI.updateStock(productId, parseInt(newStock));
      await loadData();
    } catch (error) {
      alert("اسٹاک اپ ڈیٹ کرنے میں خرابی: " + error.message);
    }
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
        <h2 className="text-2xl font-bold text-gray-800">
          مصنوعات کی مینیجمنٹ
        </h2>
        <Button onClick={handleAddNew} urduText={true}>
          نئی مصنوعات شامل کریں
        </Button>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="table-header">نام</th>
              <th className="table-header">قسم</th>
              <th className="table-header">برانڈ</th>
              <th className="table-header">قیمت</th>
              <th className="table-header">اسٹاک</th>
              <th className="table-header">عمل</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="table-cell">
                  <div>
                    <div className="font-semibold">
                      {product.nameUrdu || product.name}
                    </div>
                    {product.barcode && (
                      <div className="text-sm text-gray-500">
                        بارکوڈ: {product.barcode}
                      </div>
                    )}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="font-urdu">
                    {product.category?.nameUrdu}
                    {product.subcategory &&
                      ` / ${product.subcategory.nameUrdu}`}
                  </div>
                </td>
                <td className="table-cell font-urdu">
                  {product.brand?.nameUrdu || "-"}
                </td>
                <td className="table-cell">
                  <div className="text-green-600 font-semibold">
                    Rs. {product.price.toFixed(2)}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="number"
                      value={product.stock}
                      onChange={(e) => updateStock(product._id, e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      min="0"
                    />
                    <span className="text-sm text-gray-600">
                      {product.unit}
                    </span>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      onClick={() => handleEdit(product)}
                      variant="outline"
                      size="sm"
                    >
                      ترمیم
                    </Button>
                    <Button
                      onClick={() => handleDelete(product._id)}
                      variant="danger"
                      size="sm"
                    >
                      حذف
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            کوئی مصنوعات موجود نہیں ہے
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingProduct ? "مصنوعات ترمیم کریں" : "نئی مصنوعات شامل کریں"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                انگریزی نام *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اردو نام *
              </label>
              <input
                type="text"
                value={formData.nameUrdu}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nameUrdu: e.target.value }))
                }
                className="input-field font-urdu"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                بارکوڈ
              </label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, barcode: e.target.value }))
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                یونٹ *
              </label>
              <select
                value={formData.unit}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, unit: e.target.value }))
                }
                className="input-field"
                required
              >
                {UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.labelUrdu}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                قیمت (Rs.) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                className="input-field"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                لاگت (Rs.)
              </label>
              <input
                type="number"
                value={formData.costPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    costPrice: e.target.value,
                  }))
                }
                className="input-field"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسٹاک *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stock: e.target.value }))
                }
                className="input-field"
                min="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                قسم *
              </label>
              <select
                value={formData.category}
                onChange={handleCategoryChange}
                className="input-field"
                required
              >
                <option value="">قسم منتخب کریں</option>
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
                value={formData.subcategory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subcategory: e.target.value,
                  }))
                }
                className="input-field"
                disabled={!formData.category}
              >
                <option value="">ذیلی قسم منتخب کریں</option>
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
                value={formData.brand}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, brand: e.target.value }))
                }
                className="input-field"
              >
                <option value="">برانڈ منتخب کریں</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.nameUrdu}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 space-x-reverse pt-4">
            <Button
              type="button"
              onClick={handleCloseModal}
              variant="secondary"
            >
              منسوخ کریں
            </Button>
            <Button type="submit" variant="success">
              {editingProduct ? "اپ ڈیٹ کریں" : "محفوظ کریں"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
