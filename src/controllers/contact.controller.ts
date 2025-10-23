import { Request, Response } from "express";
import Contact from "../models/contact.model";

function ok(message: string, data?: unknown) {
    return { success: true, message, data };
}

function fail(message: string) {
    return { success: false, message };
}

export async function createContact(req: Request, res: Response) {
    try {
        const { name, email, subject, message } = req.body as {
            name?: string;
            email?: string;
            subject?: string;
            message?: string;
        };

        // Validation
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return res.status(400).json(fail("Invalid name"));
        }
        if (!email || typeof email !== "string" || !email.includes("@")) {
            return res.status(400).json(fail("Invalid email"));
        }
        if (!subject || typeof subject !== "string" || subject.trim().length < 2) {
            return res.status(400).json(fail("Invalid subject"));
        }
        if (!message || typeof message !== "string" || message.trim().length < 10) {
            return res.status(400).json(fail("Invalid message"));
        }

        const contact = await Contact.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim()
        });

        return res.status(201).json(ok("Contact message sent", contact));
    } catch (err) {
        return res.status(500).json(fail("Failed to send contact message"));
    }
}

export async function getAllContacts(req: Request, res: Response) {
    try {
        const page = Math.max(1, Number(req.query.page ?? 1));
        const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Contact.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Contact.countDocuments(),
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.json({
            success: true,
            pagination: { page, totalPages, totalContacts: total },
            data: items
        });
    } catch (err) {
        return res.status(500).json(fail("Failed to fetch contact messages"));
    }
}
