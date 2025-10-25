import express from "express";
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
} from "../controllers/category.controller";

const router = express.Router();

// ✅ each route gets a function (not object / undefined)
router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);
router.post("/", createCategory);

export default router;
