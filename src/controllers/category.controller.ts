import { Request, Response } from "express";
import Category from "../models/category.model";

function ok(message: string, data?: unknown) {
    return { success: true, message, data };
}

function fail(message: string) {
    return { success: false, message };
}

export async function getAllCategories(_req: Request, res: Response) {
    try {
        const categories = await Category.find().sort({ createdAt: -1 }).lean();
        return res.json(ok("Categories fetched", { count: categories.length, categories }));
    } catch (err) {
        return res.status(500).json(fail("Failed to fetch categories"));
    }
}

export async function getCategoryById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const category = await Category.findById(id).lean();
        if (!category) return res.status(404).json(fail("Category not found"));
        return res.json(ok("Category fetched", category));
    } catch (err) {
        return res.status(500).json(fail("Failed to fetch category"));
    }
}

export async function createCategory(req: Request, res: Response) {
    try {
        const { name, description } = req.body as { name?: string; description?: string };
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return res.status(400).json(fail("Invalid name"));
        }

        const created = await Category.create({ name: name.trim(), description });
        return res.status(201).json(ok("Category created", created));
    } catch (err: any) {
        if (err && err.code === 11000) {
            return res.status(409).json(fail("Category name must be unique"));
        }
        return res.status(500).json(fail("Failed to create category"));
    }
}

export async function updateCategory(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { name, description } = req.body as { name?: string; description?: string };

        if (name && (typeof name !== "string" || name.trim().length < 2)) {
            return res.status(400).json(fail("Invalid name"));
        }

        const updated = await Category.findByIdAndUpdate(
            id,
            { $set: { ...(name ? { name: name.trim() } : {}), ...(description !== undefined ? { description } : {}) } },
            { new: true, runValidators: true }
        ).lean();

        if (!updated) return res.status(404).json(fail("Category not found"));
        return res.json(ok("Category updated", updated));
    } catch (err: any) {
        if (err && err.code === 11000) {
            return res.status(409).json(fail("Category name must be unique"));
        }
        return res.status(500).json(fail("Failed to update category"));
    }
}

export async function deleteCategory(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const deleted = await Category.findByIdAndDelete(id).lean();
        if (!deleted) return res.status(404).json(fail("Category not found"));
        return res.json(ok("Category deleted", deleted));
    } catch (err) {
        return res.status(500).json(fail("Failed to delete category"));
    }
}


