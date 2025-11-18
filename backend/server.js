import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import categoriesRoutes from "./routes/categories.js";
import subcategoriesRoutes from "./routes/subcategories.js";
import brandsRoutes from "./routes/brands.js";
import productsRoutes from "./routes/products.js";
import ordersRoutes from "./routes/orders.js";
import connectDB from "./config/database.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api/categories", categoriesRoutes);
app.use("/api/subcategories", subcategoriesRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
