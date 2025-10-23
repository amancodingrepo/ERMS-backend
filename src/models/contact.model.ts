import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        subject: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

ContactSchema.index({ email: 1 });
ContactSchema.index({ createdAt: -1 });

const Contact =
    (mongoose.models?.Contact as mongoose.Model<IContact>) ||
    mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
