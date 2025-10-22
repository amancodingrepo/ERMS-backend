import express from "express";
import mongoose from "mongoose";
import Contact from "../models/Contact";

const router = express.Router();

router.get("/", async (_req, res) => {
    try {
        const docs = await Contact.find().sort({ createdAt: -1 }).limit(50).lean();
        return res.json({ count: docs.length, data: docs });
    } catch (err) {
        console.error("Failed to fetch contacts:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    const { fullName, email, countryCode, phone, message } = req.body;

    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
        return res.status(400).json({ error: "Invalid fullName" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email" });
    }

    try {
        const doc = new Contact({
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            countryCode,
            phone,
            message
        });
        const saved = await doc.save();

        // Debug logs: DB name and collection
        console.info("Saved contact:", String(saved._id));
        console.info("DB:", (mongoose.connection.db && (mongoose.connection.db as any).databaseName) ?? "unknown");
        console.info("Collection:", Contact.collection.name);

        // return full saved document so you can inspect immediately in Postman
        return res.status(201).json({ id: saved._id, doc: saved.toObject() });
    } catch (err) {
        console.error("Failed to save contact:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;