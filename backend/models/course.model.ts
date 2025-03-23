import mongoose, { Schema, Document } from "mongoose";
import { ICourse, ILesson } from "../interface";

// Create Lesson Schema
const LessonSchema = new Schema<ILesson>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  type: { type: String, required: true },
  content: {
    videoUrl: { type: String, required: true },
    description: { type: String, required: true },
  },
  resources: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      type: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  completed: { type: Boolean, default: false },
  nextLessonId: { type: String },
  prevLessonId: { type: String },
});

// Create Course Schema
const CourseSchema: Schema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    duration: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    students: { type: Number, default: 0 },
    instructor: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedLessons: { type: [String], default: [] },
    nextLesson: {
      id: { type: String, default: "" },
      title: { type: String, default: "" },
    },
    lessons: [LessonSchema],
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
