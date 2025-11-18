import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";
import Brand from "../models/Brand.js";

const getAllProducts = async (req, res) => {
  try {
    const { category, subcategory, brand, search } = req.query;
    let filter = { isActive: true };

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (brand) filter.brand = brand;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { nameUrdu: { $regex: search, $options: "i" } },
        { barcode: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter)
      .populate("category", "name nameUrdu")
      .populate("subcategory", "name nameUrdu")
      .populate("brand", "name nameUrdu")
      .sort({ name: 1 });

    res.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name nameUrdu")
      .populate("subcategory", "name nameUrdu")
      .populate("brand", "name nameUrdu");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Validate category, subcategory, and brand
    if (productData.category) {
      const category = await Category.findById(productData.category);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    if (productData.subcategory) {
      const subcategory = await Subcategory.findById(productData.subcategory);
      if (!subcategory) {
        return res.status(404).json({
          success: false,
          message: "Subcategory not found",
        });
      }
    }

    if (productData.brand) {
      const brand = await Brand.findById(productData.brand);
      if (!brand) {
        return res.status(404).json({
          success: false,
          message: "Brand not found",
        });
      }
    }

    const product = new Product(productData);
    await product.save();
    await product.populate("category subcategory brand");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Validate category, subcategory, and brand
    if (productData.category) {
      const category = await Category.findById(productData.category);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    if (productData.subcategory) {
      const subcategory = await Subcategory.findById(productData.subcategory);
      if (!subcategory) {
        return res.status(404).json({
          success: false,
          message: "Subcategory not found",
        });
      }
    }

    if (productData.brand) {
      const brand = await Brand.findById(productData.brand);
      if (!brand) {
        return res.status(404).json({
          success: false,
          message: "Brand not found",
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...productData,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    ).populate("category subcategory brand");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Stock updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating stock",
      error: error.message,
    });
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
};
