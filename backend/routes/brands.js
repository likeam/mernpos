import express from "express";
import brandController from "../controllers/brandController.js";

const router = express.Router();

router.get("/", brandController.getAllBrands);
router.post("/", brandController.createBrand);
router.put("/:id", brandController.updateBrand);
router.delete("/:id", brandController.deleteBrand);

export default router;
