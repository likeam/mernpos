import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
};

const getAllOrders = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = {};

    if (startDate && endDate) {
      filter.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const orders = await Order.find(filter)
      .populate("items.product")
      .sort({ orderDate: -1 });

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const { items, tax, discount, cashReceived, customerName, customerPhone } =
      req.body;

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        productName: product.name,
        productNameUrdu: product.nameUrdu,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    const total = subtotal + (tax || 0) - (discount || 0);
    const change = cashReceived - total;

    if (change < 0) {
      return res.status(400).json({
        success: false,
        message: "Insufficient cash received",
      });
    }

    const order = new Order({
      orderNumber: generateOrderNumber(),
      items: orderItems,
      subtotal,
      tax: tax || 0,
      discount: discount || 0,
      total,
      paymentMethod: "cash",
      cashReceived,
      change,
      customerName,
      customerPhone,
    });

    await order.save();
    await order.populate("items.product");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

const getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getTodayOrders = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const orders = await Order.find({
      orderDate: {
        $gte: today,
        $lt: tomorrow,
      },
    })
      .populate("items.product")
      .sort({ orderDate: -1 });

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      success: true,
      data: orders,
      count: orders.length,
      totalSales,
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
  getAllOrders,
  getOrderById,
  createOrder,
  getOrderByNumber,
  getTodayOrders,
};
