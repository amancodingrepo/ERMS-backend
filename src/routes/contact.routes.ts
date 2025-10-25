import express from "express";
import { createContact, getAllContacts } from "../controllers/contact.controller";

const router = express.Router();

router.get("/", getAllContacts);
router.post("/", createContact);

export default router;
