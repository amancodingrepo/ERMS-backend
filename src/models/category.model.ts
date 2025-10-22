import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
    name: string;
    description?: string;
    createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, trim: true, unique: true },
        description: { type: String, trim: true },
        createdAt: { type: Date, default: () => new Date() },
    },
    { timestamps: true }
);

CategorySchema.index({ name: 1 }, { unique: true });

const Category =
    (mongoose.models?.Category as mongoose.Model<ICategory>) ||
    mongoose.model<ICategory>("Category", CategorySchema);

export default Category;

