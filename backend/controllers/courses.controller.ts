import { NextFunction, Request, Response } from "express";
import Course from "../models/course.model";
import User from "../models/user.model";
import mongoose from "mongoose";
import { IModule } from "../interface";

// Create a course
export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Get the complete user data from database
    const userId = req.userId;
    const instructor = await User.findById(userId);

    if (!instructor) {
      res.status(404).json({ message: "Instructor not found" });
      return;
    }

    const {
      title,
      description,
      longDescription,
      category,
      level,
      lessons,
      duration,
      price,
      image,
      tags,
      requirements,
      objectives,
      modules,
      resources,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !level ||
      !duration ||
      !price ||
      !lessons
    ) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const newCourse = await Course.create({
      title,
      description,
      longDescription,
      category,
      level,
      duration,
      price,
      image: image || "/placeholder.svg?height=400&width=800", // Default image if not provided
      tags: tags || [],
      requirements: requirements || [],
      objectives: objectives || [],
      modules: modules || [],
      resources: resources || [],
      instructor: {
        id: instructor._id,
        name: instructor.name,
        avatar: "/placeholder.svg?height=100&width=100", // Default avatar
      },
      rating: 0,
      reviews: 0,
      students: 0,
      featured: false,
      progress: 0,
      completedLessons: [],
      nextLesson:
        lessons && lessons.length > 0
          ? { id: lessons[0].id, title: lessons[0].title }
          : { id: "", title: "" },
      lessons: lessons || [],
      enrolled: false,
    });

    console.log("Course created:", newCourse);

    res.status(201).json({ message: "Course Created", course: newCourse });
  } catch (error: any) {
    console.error("Error creating course:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to create course" });
  }
};

// Get all courses
export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const courses = await Course.find({});
    res.status(200).json({ courses });
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch courses" });
  }
};

// Get course for instructor
export const getInstructorCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const courses = await Course.find({ "instructor.id": id });
    res.status(200).json({ courses });
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch courses" });
  }
};

// Get course by ID
export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      res.status(400).json({ message: "Invalid course ID" });
      return;
    }

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.status(200).json({ course });
  } catch (error: any) {
    console.error("Error fetching course:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch course" });
  }
};

// Enroll in a course
export const enrollCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { courseId } = req.params;
    const userId = req.userId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // Find user and update enrolled courses
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if already enrolled
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const enrolledCourses = user.enrolledCourses as mongoose.Types.ObjectId[];

    if (enrolledCourses.some((id) => id.equals(courseObjectId))) {
      res.status(400).json({ message: "Already enrolled in this course" });
      return;
    }

    // Update user's enrolled courses
    enrolledCourses.push(courseObjectId);
    await user.save();

    // Update course's student count
    course.students += 1;
    course.enrolled = true;
    await course.save();

    console.log("Enrolled in course:", course);

    res.status(200).json({ message: "Successfully enrolled in course" });
  } catch (error: any) {
    console.error("Error enrolling in course:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to enroll in course" });
  }
};

// Get lesson content
export const getLessonContent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { courseId, lessonId } = req.params;
    const userId = req.userId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if user is enrolled in the course
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const enrolledCourses = user.enrolledCourses as mongoose.Types.ObjectId[];

    if (!enrolledCourses.some((id) => id.equals(courseObjectId))) {
      res.status(403).json({ message: "Not enrolled in this course" });
      return;
    }

    // Find the lesson
    const lesson = course.lessons.find((l) => l.id === lessonId);
    if (!lesson) {
      res.status(404).json({ message: "Lesson not found" });
      return;
    }

    res.status(200).json({ lesson });
  } catch (error: any) {
    console.error("Error fetching lesson:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch lesson" });
  }
};

// Mark lesson as completed
export const markLessonComplete = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { courseId, lessonId } = req.params;
    const userId = req.userId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if user is enrolled in the course
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const enrolledCourses = user.enrolledCourses as mongoose.Types.ObjectId[];

    if (!enrolledCourses.some((id) => id.equals(courseObjectId))) {
      res.status(403).json({ message: "Not enrolled in this course" });
      return;
    }

    // Find the lesson
    const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
    if (lessonIndex === -1) {
      res.status(404).json({ message: "Lesson not found" });
      return;
    }

    // Mark lesson as completed
    course.lessons[lessonIndex].completed = true;

    // Add to completed lessons if not already there
    if (!course.completedLessons.includes(lessonId)) {
      course.completedLessons.push(lessonId);
    }

    // Calculate progress
    const totalLessons = course.lessons.length;
    const completedCount = course.completedLessons.length;
    course.progress = Math.round((completedCount / totalLessons) * 100);

    // Update next lesson if there's a next one
    if (lessonIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[lessonIndex + 1];
      course.nextLesson = {
        id: nextLesson.id,
        title: nextLesson.title,
      };
    }

    await course.save();

    console.log("Marked lesson as complete");

    res.status(200).json({
      message: "Lesson marked as completed",
      progress: course.progress,
      nextLesson: course.nextLesson,
    });
  } catch (error: any) {
    console.error("Error marking lesson complete:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to mark lesson as complete" });
  }
};
