import cors from "cors";
import express from "express";

import "#db";
import { authRoutes } from "#routes";
import { errorHandler } from "#middleware";

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}));
app.use(express.json());

app.use("/auth", authRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
