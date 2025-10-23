import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";

export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    thumbnailUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, trim: true, unique: true },
        slug: { type: String, unique: true, lowercase: true },
        description: { type: String, trim: true },
        thumbnailUrl: { type: String, trim: true },
    },
    { timestamps: true }
);

// Generate slug from name before saving
CategorySchema.pre("save", function (next) {
    if (this.isModified("name") || !this.slug) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ name: 1 }, { unique: true });

const Category =
    (mongoose.models?.Category as mongoose.Model<ICategory>) ||
    mongoose.model<ICategory>("Category", CategorySchema);

export default Category;

