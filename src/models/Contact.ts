import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document {
    fullName: string;
    email: string;
    countryCode?: string;
    phone?: string;
    message?: string;
    createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        countryCode: { type: String },
        phone: { type: String },
        message: { type: String },
        createdAt: { type: Date, default: () => new Date() },
    },
    { timestamps: true }
);

const Contact =
    (mongoose.models?.Contact as mongoose.Model<IContact>) ||
    mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;