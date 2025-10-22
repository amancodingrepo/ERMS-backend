import mongoose, { Document, Schema, Types } from "mongoose";

export type ReportStatus = "draft" | "pending" | "approved" | "rejected";

export interface IReport extends Document {
    title: string;
    category: Types.ObjectId;
    description?: string;
    status: ReportStatus;
    reporterName?: string;
    location?: string;
    tags: string[];
    createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
    {
        title: { type: String, required: true, trim: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        description: { type: String, trim: true },
        status: { type: String, enum: ["draft", "pending", "approved", "rejected"], default: "draft" },
        reporterName: { type: String, trim: true },
        location: { type: String, trim: true },
        tags: { type: [String], default: [] },
        createdAt: { type: Date, default: () => new Date() },
    },
    { timestamps: true }
);

ReportSchema.index({ title: "text", description: "text", tags: 1 });

const Report =
    (mongoose.models?.Report as mongoose.Model<IReport>) ||
    mongoose.model<IReport>("Report", ReportSchema);

export default Report;

