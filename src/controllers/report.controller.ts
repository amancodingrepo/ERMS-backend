import { Request, Response } from "express";
import Report from "../models/report.model";

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

        const [items, total] = await Promise.all([
            Report.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("category")
                .lean(),
            Report.countDocuments(),
        ]);

        return res.json(
            ok("Reports fetched", {
                pagination: { page, limit, total, pages: Math.ceil(total / limit) },
                count: items.length,
                items,
            })
        );
    } catch (err) {
        return res.status(500).json(fail("Failed to fetch reports"));
    }
}

export async function getReportById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const report = await Report.findById(id).populate("category").lean();
        if (!report) return res.status(404).json(fail("Report not found"));
        return res.json(ok("Report fetched", report));
    } catch (err) {
        return res.status(500).json(fail("Failed to fetch report"));
    }
}

export async function createReport(req: Request, res: Response) {
    try {
        const { title, category, description, status, reporterName, location, tags } = req.body as {
            title?: string;
            category?: string;
            description?: string;
            status?: string;
            reporterName?: string;
            location?: string;
            tags?: string[];
        };

        if (!title || typeof title !== "string" || title.trim().length < 2) {
            return res.status(400).json(fail("Invalid title"));
        }
        if (!category) {
            return res.status(400).json(fail("Category is required"));
        }
        if (status && !["draft", "pending", "approved", "rejected"].includes(status)) {
            return res.status(400).json(fail("Invalid status"));
        }

        const created = await Report.create({
            title: title.trim(),
            category,
            description,
            status,
            reporterName,
            location,
            tags: Array.isArray(tags) ? tags : [],
        });

        const populated = await created.populate("category");
        return res.status(201).json(ok("Report created", populated));
    } catch (err) {
        return res.status(500).json(fail("Failed to create report"));
    }
}

export async function updateReport(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { title, category, description, status, reporterName, location, tags } = req.body as {
            title?: string;
            category?: string;
            description?: string;
            status?: string;
            reporterName?: string;
            location?: string;
            tags?: string[];
        };

        if (title && (typeof title !== "string" || title.trim().length < 2)) {
            return res.status(400).json(fail("Invalid title"));
        }
        if (status && !["draft", "pending", "approved", "rejected"].includes(status)) {
            return res.status(400).json(fail("Invalid status"));
        }

        const updated = await Report.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...(title ? { title: title.trim() } : {}),
                    ...(category ? { category } : {}),
                    ...(description !== undefined ? { description } : {}),
                    ...(status ? { status } : {}),
                    ...(reporterName !== undefined ? { reporterName } : {}),
                    ...(location !== undefined ? { location } : {}),
                    ...(Array.isArray(tags) ? { tags } : {}),
                },
            },
            { new: true, runValidators: true }
        )
            .populate("category")
            .lean();

        if (!updated) return res.status(404).json(fail("Report not found"));
        return res.json(ok("Report updated", updated));
    } catch (err) {
        return res.status(500).json(fail("Failed to update report"));
    }
}

export async function deleteReport(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const deleted = await Report.findByIdAndDelete(id).lean();
        if (!deleted) return res.status(404).json(fail("Report not found"));
        return res.json(ok("Report deleted", deleted));
    } catch (err) {
        return res.status(500).json(fail("Failed to delete report"));
    }
}

export async function searchReports(req: Request, res: Response) {
    try {
        const query = String(req.query.query ?? "").trim();
        if (!query) return res.json(ok("Search results", { count: 0, items: [] }));

        const items = await Report.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { tags: { $in: [new RegExp(query, "i")] } },
            ],
        })
            .limit(50)
            .populate("category")
            .lean();

        return res.json(ok("Search results", { count: items.length, items }));
    } catch (err) {
        return res.status(500).json(fail("Failed to search reports"));
    }
}


