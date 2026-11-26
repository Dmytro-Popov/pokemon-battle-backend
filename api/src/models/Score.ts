import { Schema, model } from "mongoose";

const scoreSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model("Score", scoreSchema);