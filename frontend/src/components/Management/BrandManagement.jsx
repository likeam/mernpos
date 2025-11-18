import React, { useState, useEffect } from "react";
import { brandsAPI } from "../../services/api";
import Button from "../UI/Button";
import Modal from "../UI/Modal";

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nameUrdu: "",
    description: "",
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const response = await brandsAPI.getAll();
      setBrands(response.data);
    } catch (error) {
      console.error("Error loading brands:", error);
      alert("برانڈز لوڈ کرنے میں خرابی: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBrand) {
        await brandsAPI.update(editingBrand._id, formData);
      } else {
        await brandsAPI.create(formData);
      }

      await loadBrands();
      handleCloseModal();
    } catch (error) {
      alert("محفوظ کرنے میں خرابی: " + error.message);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      nameUrdu: brand.nameUrdu,
      description: brand.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (brandId) => {
    if (window.confirm("کیا آپ واقعی اس برانڈ کو حذف کرنا چاہتے ہیں؟")) {
      try {
        await brandsAPI.delete(brandId);
        await loadBrands();
      } catch (error) {
        alert("حذف کرنے میں خرابی: " + error.message);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBrand(null);
    setFormData({
      name: "",
      nameUrdu: "",
      description: "",
    });
  };

  const handleAddNew = () => {
    setEditingBrand(null);
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
        <h2 className="text-2xl font-bold text-gray-800">برانڈز کی مینیجمنٹ</h2>
        <Button onClick={handleAddNew} urduText={true}>
          نیا برانڈ شامل کریں
        </Button>
      </div>

      {/* Brands Table */}
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
            {brands.map((brand) => (
              <tr key={brand._id} className="hover:bg-gray-50">
                <td className="table-cell">{brand.name}</td>
                <td className="table-cell font-urdu">{brand.nameUrdu}</td>
                <td className="table-cell">{brand.description || "-"}</td>
                <td className="table-cell">
                  {new Date(brand.createdAt).toLocaleDateString("ur-PK")}
                </td>
                <td className="table-cell">
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      onClick={() => handleEdit(brand)}
                      variant="outline"
                      size="sm"
                    >
                      ترمیم
                    </Button>
                    <Button
                      onClick={() => handleDelete(brand._id)}
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

        {brands.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            کوئی برانڈ موجود نہیں ہے
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingBrand ? "برانڈ ترمیم کریں" : "نیا برانڈ شامل کریں"}
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
              {editingBrand ? "اپ ڈیٹ کریں" : "محفوظ کریں"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BrandManagement;
