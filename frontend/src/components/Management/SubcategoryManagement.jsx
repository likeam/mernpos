import React, { useState, useEffect } from "react";
import { subcategoriesAPI, categoriesAPI } from "../../services/api";
import Button from "../UI/Button";
import Modal from "../UI/Modal";

const SubcategoryManagement = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nameUrdu: "",
    category: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subcategoriesRes, categoriesRes] = await Promise.all([
        subcategoriesAPI.getAll(),
        categoriesAPI.getAll(),
      ]);

      setSubcategories(subcategoriesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("ڈیٹا لوڈ کرنے میں خرابی: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSubcategory) {
        await subcategoriesAPI.update(editingSubcategory._id, formData);
      } else {
        await subcategoriesAPI.create(formData);
      }

      await loadData();
      handleCloseModal();
    } catch (error) {
      alert("محفوظ کرنے میں خرابی: " + error.message);
    }
  };

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setFormData({
      name: subcategory.name,
      nameUrdu: subcategory.nameUrdu,
      category: subcategory.category._id,
    });
    setShowModal(true);
  };

  const handleDelete = async (subcategoryId) => {
    if (window.confirm("کیا آپ واقعی اس ذیلی قسم کو حذف کرنا چاہتے ہیں؟")) {
      try {
        await subcategoriesAPI.delete(subcategoryId);
        await loadData();
      } catch (error) {
        alert("حذف کرنے میں خرابی: " + error.message);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSubcategory(null);
    setFormData({
      name: "",
      nameUrdu: "",
      category: "",
    });
  };

  const handleAddNew = () => {
    setEditingSubcategory(null);
    setFormData({
      name: "",
      nameUrdu: "",
      category: "",
    });
    setShowModal(true);
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
          ذیلی اقسام کی مینیجمنٹ
        </h2>
        <Button onClick={handleAddNew} urduText={true}>
          نئی ذیلی قسم شامل کریں
        </Button>
      </div>

      {/* Subcategories Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="table-header">انگریزی نام</th>
              <th className="table-header">اردو نام</th>
              <th className="table-header">قسم</th>
              <th className="table-header">تاریخ</th>
              <th className="table-header">عمل</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((subcategory) => (
              <tr key={subcategory._id} className="hover:bg-gray-50">
                <td className="table-cell">{subcategory.name}</td>
                <td className="table-cell font-urdu">{subcategory.nameUrdu}</td>
                <td className="table-cell font-urdu">
                  {subcategory.category?.nameUrdu}
                </td>
                <td className="table-cell">
                  {new Date(subcategory.createdAt).toLocaleDateString("ur-PK")}
                </td>
                <td className="table-cell">
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      onClick={() => handleEdit(subcategory)}
                      variant="outline"
                      size="sm"
                    >
                      ترمیم
                    </Button>
                    <Button
                      onClick={() => handleDelete(subcategory._id)}
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

        {subcategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            کوئی ذیلی قسم موجود نہیں ہے
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={
          editingSubcategory ? "ذیلی قسم ترمیم کریں" : "نئی ذیلی قسم شامل کریں"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              قسم *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
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

          <div className="flex justify-end space-x-3 space-x-reverse pt-4">
            <Button
              type="button"
              onClick={handleCloseModal}
              variant="secondary"
            >
              منسوخ کریں
            </Button>
            <Button type="submit" variant="success">
              {editingSubcategory ? "اپ ڈیٹ کریں" : "محفوظ کریں"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubcategoryManagement;
