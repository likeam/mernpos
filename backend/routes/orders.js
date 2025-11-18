import express from "express";
import orderController from "../controllers/orderController.js";

const router = express.Router();

router.get("/", orderController.getAllOrders);
router.get("/today", orderController.getTodayOrders);
router.get("/:id", orderController.getOrderById);
router.get("/number/:orderNumber", orderController.getOrderByNumber);
router.post("/", orderController.createOrder);

export default router;
