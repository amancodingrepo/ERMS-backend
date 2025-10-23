import { Request, Response } from "express";
import Report from "../models/report.model";
import Category from "../models/category.model";

function ok(message: string, data?: unknown) {
    return { success: true, message, data };
}

function fail(message: string) {
    return { success: false, message };
}

export async function getAllReports(req: Request, res: Response) {
    try {
        const page = Math.max(1, Number(req.query.page ?? 1));
        const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
        const skip = (page - 1) * limit;
        const categorySlug = req.query.category as string;
        const search = req.query.search as string;

        // Build query
        let query: any = {};
        
        // Filter by category if provided
        if (categorySlug) {
            const category = await Category.findOne({ slug: categorySlug });
            if (!category) {
                return res.status(404).json(fail("Category not found"));
            }
            query.category = category._id;
        }

        // Add search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { summary: { $regex: search, $options: "i" } },
                { "meta.keywords": { $in: [new RegExp(search, "i")] } }
            ];
        }

        const [items, total] = await Promise.all([
            Report.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("category", "name slug")
                .lean(),
            Report.countDocuments(query),
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.json({
            success: true,
            pagination: { page, totalPages, totalReports: total },
            data: items
        });
    } catch (err) {
        return res.status(500).json(fail("Failed to fetch reports"));
    }
}

export async function getReportBySlug(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        const report = await Report.findOne({ slug }).populate("category", "name slug").lean();
        if (!report) return res.status(404).json(fail("Report not found"));
        return res.json({
            success: true,
            report: report
        });
    } catch (err) {
        return res.status(500).json(fail("Failed to fetch report"));
    }
}

export async function createReport(req: Request, res: Response) {
    try {
        const { 
            title, 
            category, 
            description, 
            summary, 
            publishDate, 
            imageUrl, 
            price, 
            keyHighlights, 
            tableOfContent, 
            meta 
        } = req.body as {
            title?: string;
            category?: string;
            description?: string;
            summary?: string;
            publishDate?: string;
            imageUrl?: string;
            price?: number;
            keyHighlights?: string[];
            tableOfContent?: string[];
            meta?: {
                keywords?: string[];
                seoDescription?: string;
            };
        };

        if (!title || typeof title !== "string" || title.trim().length < 2) {
            return res.status(400).json(fail("Invalid title"));
        }
        if (!category) {
            return res.status(400).json(fail("Category is required"));
        }

        // Find category by slug
        const categoryDoc = await Category.findOne({ slug: category });
        if (!categoryDoc) {
            return res.status(404).json(fail("Category not found"));
        }

        const created = await Report.create({
            title: title.trim(),
            category: categoryDoc._id,
            description,
            summary,
            publishDate: publishDate ? new Date(publishDate) : undefined,
            imageUrl,
            price,
            keyHighlights: Array.isArray(keyHighlights) ? keyHighlights : [],
            tableOfContent: Array.isArray(tableOfContent) ? tableOfContent : [],
            meta: {
                keywords: Array.isArray(meta?.keywords) ? meta.keywords : [],
                seoDescription: meta?.seoDescription || ""
            }
        });

        const populated = await created.populate("category", "name slug");
        return res.status(201).json(ok("Report created", populated));
    } catch (err) {
        return res.status(500).json(fail("Failed to create report"));
    }
}

export async function updateReport(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        const { 
            title, 
            category, 
            description, 
            summary, 
            publishDate, 
            imageUrl, 
            price, 
            keyHighlights, 
            tableOfContent, 
            meta 
        } = req.body as {
            title?: string;
            category?: string;
            description?: string;
            summary?: string;
            publishDate?: string;
            imageUrl?: string;
            price?: number;
            keyHighlights?: string[];
            tableOfContent?: string[];
            meta?: {
                keywords?: string[];
                seoDescription?: string;
            };
        };

        if (title && (typeof title !== "string" || title.trim().length < 2)) {
            return res.status(400).json(fail("Invalid title"));
        }

        const updateData: any = {};
        if (title) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description;
        if (summary !== undefined) updateData.summary = summary;
        if (publishDate !== undefined) updateData.publishDate = publishDate ? new Date(publishDate) : null;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
        if (price !== undefined) updateData.price = price;
        if (Array.isArray(keyHighlights)) updateData.keyHighlights = keyHighlights;
        if (Array.isArray(tableOfContent)) updateData.tableOfContent = tableOfContent;
        if (meta) updateData.meta = meta;

        // Handle category update
        if (category) {
            const categoryDoc = await Category.findOne({ slug: category });
            if (!categoryDoc) {
                return res.status(404).json(fail("Category not found"));
            }
            updateData.category = categoryDoc._id;
        }

        const updated = await Report.findOneAndUpdate(
            { slug },
            { $set: updateData },
            { new: true, runValidators: true }
        )
            .populate("category", "name slug")
            .lean();

        if (!updated) return res.status(404).json(fail("Report not found"));
        return res.json(ok("Report updated", updated));
    } catch (err) {
        return res.status(500).json(fail("Failed to update report"));
    }
}

export async function deleteReport(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        const deleted = await Report.findOneAndDelete({ slug }).lean();
        if (!deleted) return res.status(404).json(fail("Report not found"));
        return res.json(ok("Report deleted", deleted));
    } catch (err) {
        return res.status(500).json(fail("Failed to delete report"));
    }
}



