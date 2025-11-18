import express from "express";
import subcategoryController from "../controllers/subcategoryController.js";

const router = express.Router();

router.get("/", subcategoryController.getAllSubcategories);
router.get(
  "/category/:categoryId",
  subcategoryController.getSubcategoriesByCategory
);
router.post("/", subcategoryController.createSubcategory);
router.put("/:id", subcategoryController.updateSubcategory);
router.delete("/:id", subcategoryController.deleteSubcategory);

export default router;
