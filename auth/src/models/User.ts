import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    username: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      unique: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username must be at most 20 characters long"],
    },
  },
  {
    timestamps: true,
  },
);

export const User = model("User", userSchema, "users")