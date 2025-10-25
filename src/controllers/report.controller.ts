import { Request, Response } from "express";
import Report from "../models/report.model";
import { fail, ok } from "../utils/response";

export async function getAllReports(req: Request, res: Response) {
  try {
    const reports = await Report.find()
      .populate("category", "name slug")
      .lean();

    return res.json(ok("Reports fetched successfully", reports));
  } catch (err: any) {
    console.error("❌ Error in getAllReports:", err);
    return res.status(500).json(fail(err.message || "Failed to fetch reports"));
  }
}

export async function createReport(req: Request, res: Response) {
  try {
    const report = await Report.create(req.body);
    return res.status(201).json(ok("Report created successfully", report));
  } catch (err: any) {
    console.error("❌ Error in createReport:", err);
    return res.status(500).json(fail(err.message || "Failed to create report"));
  }
}

export async function updateReport(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const report = await Report.findOneAndUpdate({ slug }, req.body, {
      new: true,
    }).populate("category", "name slug");

    if (!report) {
      return res.status(404).json(fail("Report not found"));
    }

    return res.json(ok("Report updated successfully", report));
  } catch (err: any) {
    console.error("❌ Error in updateReport:", err);
    return res.status(500).json(fail(err.message || "Failed to update report"));
  }
}

export async function deleteReport(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const report = await Report.findOneAndDelete({ slug });

    if (!report) {
      return res.status(404).json(fail("Report not found"));
    }

    return res.json(ok("Report deleted successfully"));
  } catch (err: any) {
    console.error("❌ Error in deleteReport:", err);
    return res.status(500).json(fail(err.message || "Failed to delete report"));
  }
}

export async function getReportBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const report = await Report.findOne({ slug })
      .populate("category", "name slug")
      .lean();

    if (!report) {
      return res.status(404).json(fail("Report not found"));
    }

    return res.json(ok("Report fetched successfully", report));
  } catch (err: any) {
    console.error("❌ Error in getReportBySlug:", err);
    return res.status(500).json(fail(err.message || "Failed to fetch report"));
  }
}
