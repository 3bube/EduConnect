import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

// Create User Model
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
