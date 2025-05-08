import { Document, Types } from "mongoose";

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "student" | "tutor" | "both" | "admin"; // Updated role types
  enrolledCourses: Types.ObjectId[] | string; // Array of ObjectId references to Course model
  certificates: Types.ObjectId[]; // Array of ObjectId references to Certificate model
  bio?: string;
  qualification?: string;
  expertise?: string;
  experience?: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
