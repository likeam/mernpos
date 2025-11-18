import Subcategory from "../models/Subcategory.js";
import Category from "../models/Category.js";

const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ isActive: true })
      .populate("category", "name nameUrdu")
      .sort({ name: 1 });

    res.json({
      success: true,
      data: subcategories,
      count: subcategories.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getSubcategoriesByCategory = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({
      category: req.params.categoryId,
      isActive: true,
    }).sort({ name: 1 });

    res.json({
      success: true,
      data: subcategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const createSubcategory = async (req, res) => {
  try {
    const { name, nameUrdu, category } = req.body;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const subcategory = new Subcategory({
      name,
      nameUrdu,
      category,
    });

    await subcategory.save();
    await subcategory.populate("category", "name nameUrdu");

    res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      data: subcategory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating subcategory",
      error: error.message,
    });
  }
};

const updateSubcategory = async (req, res) => {
  try {
    const { name, nameUrdu, category, isActive } = req.body;

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      {
        name,
        nameUrdu,
        category,
        isActive,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    ).populate("category", "name nameUrdu");

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    res.json({
      success: true,
      message: "Subcategory updated successfully",
      data: subcategory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating subcategory",
      error: error.message,
    });
  }
};

const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    res.json({
      success: true,
      message: "Subcategory deleted successfully",
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
  getAllSubcategories,
  getSubcategoriesByCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
