import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const DEFAULT_MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 500;

export interface ConnectOptions {
    uri?: string;
    maxRetries?: number;
}

/**
 * Connects to MongoDB using mongoose with exponential backoff retries.
 * Throws if connection cannot be established after retries.
 */
export async function connectDB(options: ConnectOptions = {}): Promise<typeof mongoose> {
    const uri = options.uri ?? process.env.MONGODB_URI;
    const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;

    if (!uri) {
        throw new Error("MONGODB_URI environment variable is not set");
    }

    // Recommended options for modern mongoose
    const mongooseOptions: mongoose.ConnectOptions = {
        // connection pool & socket options
        maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE ?? 10),
        minPoolSize: Number(process.env.MONGODB_MIN_POOL_SIZE ?? 0),
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        // useUnifiedTopology and useNewUrlParser are default true in recent mongoose versions,
        // but leaving explicit options doesn't hurt if using older versions:
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    };

    let attempt = 0;
    while (attempt <= maxRetries) {
        try {
            attempt++;
            await mongoose.connect(uri, mongooseOptions);
            // Register connection event listeners
            mongoose.connection.on("connected", () => {
                console.info("MongoDB connected");
            });
            mongoose.connection.on("reconnected", () => {
                console.info("MongoDB reconnected");
            });
            mongoose.connection.on("disconnected", () => {
                console.warn("MongoDB disconnected");
            });
            mongoose.connection.on("error", (err) => {
                console.error("MongoDB error", err);
            });
            return mongoose;
        } catch (err) {
            const isLast = attempt > maxRetries;
            console.error(`MongoDB connection attempt ${attempt} failed:`, (err as Error).message);
            if (isLast) {
                console.error("Exceeded maximum MongoDB connection retries");
                throw err;
            }
            const backoff = BASE_BACKOFF_MS * Math.pow(2, attempt - 1);
            await new Promise((res) => setTimeout(res, backoff));
        }
    }

    // unreachable, but satisfy types
    throw new Error("Failed to connect to MongoDB");
}

export async function disconnectDB(): Promise<void> {
    try {
        await mongoose.disconnect();
        console.info("MongoDB disconnected (manual)");
    } catch (err) {
        console.error("Error during MongoDB disconnect:", (err as Error).message);
    }
}