import cors from "cors";
import "dotenv/config";
import * as http from "http";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "./db/mongoose";
import categoryRoutes from "./routes/category.routes";
import reportRoutes from "./routes/report.routes";
import contactRoutes from "./routes/contact.routes";
import express = require("express");

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.send("Backend is running"));
app.use("/api/contacts", contactRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reports", reportRoutes);

app.get("/db-status", async (_req, res) => {
    const state = mongoose.connection.readyState;
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    const human = states[state] ?? `unknown(${state})`;

    // optional ping when connected
    let ping = null;
    if (state === 1) {
        try {
            // run a lightweight ping to confirm DB responsiveness
            // mongoose.connection.db may be undefined if not fully initialized
            // so guard it
            if (mongoose.connection.db) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const adminDb = (mongoose.connection.db as any).admin();
                await adminDb.ping();
                ping = "ok";
            } else {
                ping = "no-db-object";
            }
        } catch (err) {
            ping = `error: ${(err as Error).message}`;
        }
    }

    res.json({ state, human, ping });
});

const PORT = Number(process.env.PORT ?? 3007);

async function start(): Promise<http.Server> {
    await connectDB({ maxRetries: Number(process.env.MONGODB_MAX_RETRIES ?? 5) });

    const server = app.listen(PORT, () => {
        console.info(`Server listening on http://localhost:${PORT}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
        console.info(`Received ${signal}, shutting down...`);
        server.close(async (err) => {
            if (err) {
                console.error("Error closing server:", err);
                process.exit(1);
            }
            await disconnectDB();
            process.exit(0);
        });

        // Force exit if shutdown takes too long
        setTimeout(() => {
            console.error("Forcing shutdown after timeout");
            process.exit(1);
        }, 30_000).unref();
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

    return server;
}

start().catch((err) => {
    console.error("Failed to start application:", (err as Error).message);
    process.exit(1);
});