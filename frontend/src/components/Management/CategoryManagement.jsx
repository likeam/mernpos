import React, { useState, useEffect } from "react";
import { categoriesAPI } from "../../services/api";
import Button from "../UI/Button";
import Modal from "../UI/Modal";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nameUrdu: "",
    description: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
      alert("اقسام لوڈ کرنے میں خرابی: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory._id, formData);
      } else {
        await categoriesAPI.create(formData);
      }

      await loadCategories();
      handleCloseModal();
    } catch (error) {
      alert("محفوظ کرنے میں خرابی: " + error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameUrdu: category.nameUrdu,
      description: category.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("کیا آپ واقعی اس قسم کو حذف کرنا چاہتے ہیں؟")) {
      try {
        await categoriesAPI.delete(categoryId);
        await loadCategories();
      } catch (error) {
        alert("حذف کرنے میں خرابی: " + error.message);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      nameUrdu: "",
      description: "",
    });
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      nameUrdu: "",
      description: "",
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
        <h2 className="text-2xl font-bold text-gray-800">اقسام کی مینیجمنٹ</h2>
        <Button onClick={handleAddNew} urduText={true}>
          نئی قسم شامل کریں
        </Button>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="table-header">انگریزی نام</th>
              <th className="table-header">اردو نام</th>
              <th className="table-header">تفصیل</th>
              <th className="table-header">تاریخ</th>
              <th className="table-header">عمل</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="table-cell">{category.name}</td>
                <td className="table-cell font-urdu">{category.nameUrdu}</td>
                <td className="table-cell">{category.description || "-"}</td>
                <td className="table-cell">
                  {new Date(category.createdAt).toLocaleDateString("ur-PK")}
                </td>
                <td className="table-cell">
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      onClick={() => handleEdit(category)}
                      variant="outline"
                      size="sm"
                    >
                      ترمیم
                    </Button>
                    <Button
                      onClick={() => handleDelete(category._id)}
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

        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            کوئی قسم موجود نہیں ہے
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingCategory ? "قسم ترمیم کریں" : "نئی قسم شامل کریں"}
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
              تفصیل
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="input-field"
              rows="3"
            />
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
              {editingCategory ? "اپ ڈیٹ کریں" : "محفوظ کریں"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
