import { Request, Response } from "express";
import Contact from "../models/contact.model";

/**
 * @desc Create a new contact message
 * @route POST /api/contacts
 */
export async function createContact(req: Request, res: Response) {
  try {
    const { name, email, subject, message } = req.body;

    // ✅ Validate all fields
    if (
      !name?.trim() ||
      !email?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // ✅ Create a new contact entry
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: contact,
    });
  } catch (err) {
    console.error("❌ Error creating contact:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

/**
 * @desc Get all contact messages
 * @route GET /api/contacts
 */
export async function getAllContacts(_req: Request, res: Response) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: contacts });
  } catch (err) {
    console.error("❌ Error fetching contacts:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch contacts" });
  }
}
