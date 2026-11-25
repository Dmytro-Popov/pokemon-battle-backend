import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined");
  process.exit(1);
}

try {
  if (!MONGO_URI) throw new Error("MONGO_URI is not defined");

  await mongoose.connect(MONGO_URI);

  console.log(`\x1b[35mMongoDB connected via Mongoose\x1b[0m`);
} catch (err) {
  console.error("Error connecting to MongoDB:", err);
  process.exit(1);
}
