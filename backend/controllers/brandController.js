import Brand from "../models/Brand.js";

const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
    res.json({
      success: true,
      data: brands,
      count: brands.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const createBrand = async (req, res) => {
  try {
    const { name, nameUrdu, description } = req.body;

    const brand = new Brand({
      name,
      nameUrdu,
      description,
    });

    await brand.save();

    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: brand,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating brand",
      error: error.message,
    });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { name, nameUrdu, description, isActive } = req.body;

    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        name,
        nameUrdu,
        description,
        isActive,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.json({
      success: true,
      message: "Brand updated successfully",
      data: brand,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating brand",
      error: error.message,
    });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export default {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
};
