import mongoose, { Schema } from "mongoose";

export interface ICourseProgress {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  completedLessons: string[]; // Changed to string[] to handle non-ObjectId lesson IDs
  completedAssignments: mongoose.Types.ObjectId[];
  progress: number; // percentage of course completed
  lastAccessed: Date;
  timeSpent: number; // in minutes
  startDate: Date;
  updatedAt?: Date;
  createdAt?: Date;
}

const CourseProgressSchema = new Schema<ICourseProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedLessons: [
      {
        type: String, // Changed to String to handle non-ObjectId lesson IDs
      },
    ],
    completedAssignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Create a compound index for efficient queries
CourseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const CourseProgress = mongoose.model<ICourseProgress>(
  "CourseProgress",
  CourseProgressSchema
);

export default CourseProgress;
