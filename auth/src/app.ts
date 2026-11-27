import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import "#db";
import { authRoutes } from "#routes";
import { errorHandler } from "#middleware";

const app = express();
const PORT = process.env.PORT || 5002;

const allowedOrigins = (process.env.FRONTEND_URL ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);


app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
