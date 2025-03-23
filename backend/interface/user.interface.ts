import { Document, Types } from "mongoose";

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher" | "admin"; // Explicit role types
  enrolledCourses: Types.ObjectId[] | string; // Array of ObjectId references to Course model
  comparePassword(candidatePassword: string): Promise<boolean>;
}
