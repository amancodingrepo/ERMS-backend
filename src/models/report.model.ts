import mongoose, { Document, Schema, Types } from "mongoose";
import slugify from "slugify";

export interface IReportMeta {
    keywords?: string[];
    seoDescription?: string;
}

export interface IReport extends Document {
    title: string;
    slug: string;
    category: Types.ObjectId;
    description?: string;
    summary?: string;
    publishDate?: Date;
    imageUrl?: string;
    price?: number;
    keyHighlights: string[];
    tableOfContent: string[];
    meta: IReportMeta;
    createdAt: Date;
    updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, unique: true, lowercase: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        description: { type: String, trim: true },
        summary: { type: String, trim: true },
        publishDate: { type: Date },
        imageUrl: { type: String, trim: true },
        price: { type: Number, min: 0 },
        keyHighlights: { type: [String], default: [] },
        tableOfContent: { type: [String], default: [] },
        meta: {
            keywords: { type: [String], default: [] },
            seoDescription: { type: String, trim: true }
        }
    },
    { timestamps: true }
);

// Generate slug from title before saving
ReportSchema.pre("save", function (next) {
    if (this.isModified("title") || !this.slug) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

ReportSchema.index({ slug: 1 }, { unique: true });
ReportSchema.index({ title: "text", description: "text", summary: "text" });

const Report =
    (mongoose.models?.Report as mongoose.Model<IReport>) ||
    mongoose.model<IReport>("Report", ReportSchema);

export default Report;

