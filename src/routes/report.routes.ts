import express from "express";
import { createReport, deleteReport, getAllReports, getReportById, searchReports, updateReport } from "../controllers/report.controller";

const router = express.Router();

router.get("/", getAllReports);
router.get("/search", searchReports);
router.get("/:id", getReportById);
router.post("/", createReport);
router.put("/:id", updateReport);
router.delete("/:id", deleteReport);

export default router;


