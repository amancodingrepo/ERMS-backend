import { Request, Response } from "express";
import Category from "../models/category.model";

export async function getAllCategories(req: Request, res: Response) {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      message: "Categories fetched",
      data: {
        count: categories.length,
        categories,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch categories",
    });
  }
}

export async function getCategoryBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug }).lean();
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    return res.json({ success: true, category });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch category",
    });
  }
}

export async function createCategory(req: Request, res: Response) {
  try {
    const { name, description, thumbnailUrl, slug } = req.body;
    if (!name || !slug)
      return res
        .status(400)
        .json({ success: false, message: "Name and slug are required" });

    const exists = await Category.findOne({ slug });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });

    const category = await Category.create({
      name: name.trim(),
      description,
      thumbnailUrl,
      slug: slug.trim(),
    });

    return res.status(201).json({ success: true, category });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create category",
    });
  }
}
