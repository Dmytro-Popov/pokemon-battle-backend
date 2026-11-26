import "#db";
import cors from "cors";
import express from "express";

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
