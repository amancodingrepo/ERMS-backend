import express from "express";
import { createCategory, deleteCategory, getAllCategories, getCategoryBySlug, updateCategory } from "../controllers/category.controller";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);
router.post("/", createCategory);
router.put("/:slug", updateCategory);
router.delete("/:slug", deleteCategory);

export default router;


