import express from "express";
import {
  createReport,
  deleteReport,
  getAllReports,
  getReportBySlug,
  updateReport,
} from "../controllers/report.controller";

const router = express.Router();

router.get("/", getAllReports);
router.get("/:slug", getReportBySlug);
router.post("/", createReport);
router.put("/:slug", updateReport);
router.delete("/:slug", deleteReport);

export default router;
