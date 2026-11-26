import { Schema, model } from "mongoose";

const scoreSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, unique: true },
    username: { type: String, required: true, unique: true, trim: true },
    points: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default model("Score", scoreSchema);