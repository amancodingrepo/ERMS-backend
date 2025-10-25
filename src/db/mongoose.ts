import mongoose from "mongoose";

export async function connectDB({
  maxRetries = 5,
}: { maxRetries?: number } = {}) {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("❌ MONGODB_URI not set in .env file");

  let retries = 0;
  while (retries < maxRetries) {
    try {
      await mongoose.connect(mongoUri);
      console.log("✅ Connected to MongoDB");
      return;
    } catch (err) {
      retries++;
      console.error(
        `MongoDB connection failed (${retries}/${maxRetries}):`,
        (err as Error).message
      );
      if (retries === maxRetries) throw err;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  console.log("🛑 Disconnected from MongoDB");
}
