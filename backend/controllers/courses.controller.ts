import { NextFunction, Request, Response } from "express";
import { handleAsync } from "../utils/handler";
import { AuthRequest } from "../middleware/auth.middleware";
import Course from "../models/course.model";
import User from "../models/user.model";
import mongoose from "mongoose";

// Create a course
export const createCourse = handleAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      title,
      description,
      category,
      level,
      duration,
      price,
      image,
      tags,
    } = req.body;

    if (!title || !description || !category || !level || !duration || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCourse = await Course.create({
      title,
      description,
      category,
      level,
      duration,
      price,
      image,
      tags,
      instructor: {
        id: req.user.id,
        name: req.user.email, // Using email as fallback since name may not be in JWT
        avatar: null, // Setting default
      },
    });

    res.status(201).json({ message: "Course Created", course: newCourse });
  }
);

// Get all courses
export const getAllCourses = handleAsync(
  async (req: Request, res: Response) => {
    const {
      search,
      category,
      level,
      sort,
      page = "1",
      limit = "10",
    } = req.query;

    // Build query object
    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: "i" } },
        { description: { $regex: search as string, $options: "i" } },
      ];
    }
    if (category) query.category = category;
    if (level) query.level = level;

    // Sorting logic
    const sortOptions: any = {
      popularity: { students: -1 },
      rating: { rating: -1 },
      "price-low": { price: 1 },
      "price-high": { price: -1 },
      newest: { createdAt: -1 },
    };
    const sortQuery = sort ? sortOptions[sort as string] || {} : {};

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .sort(sortQuery)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({
      courses,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  }
);

// Get course details
export const getCourseDetails = handleAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ course });
  }
);

// Enroll in a course
export const enrollCourse = handleAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user already enrolled
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert courseId to ObjectId for comparison
    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    // Type assertion for enrolled courses
    const enrolledCourses = user.enrolledCourses as mongoose.Types.ObjectId[];

    if (enrolledCourses.some((id) => id.equals(courseObjectId))) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    // Add course to user's enrolled list
    enrolledCourses.push(courseObjectId);
    await user.save();

    // Increment students count in the course
    course.students += 1;
    await course.save();

    res.status(200).json({ message: "Enrolled successfully", course });
  }
);

// Get course progress
export const getCourseProgress = handleAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user enrolled in the course
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const enrolledCourses = user.enrolledCourses as mongoose.Types.ObjectId[];
    if (
      !enrolledCourses.some((id) =>
        id.equals(new mongoose.Types.ObjectId(courseId))
      )
    ) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    // Get course progress
    const progress = await Course.findOne({
      _id: courseId,
      user: userId,
    });

    if (!progress) {
      return res.status(200).json({ progress: 0 });
    }

    res.status(200).json({ progress: progress });
  }
);

// Get lesson content
export const getLessonContent = handleAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { courseId, lessonId } = req.params;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is enrolled in the course
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const enrolledCourses = user.enrolledCourses as mongoose.Types.ObjectId[];
    if (
      !enrolledCourses.some((id) =>
        id.equals(new mongoose.Types.ObjectId(courseId))
      )
    ) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    // Find the lesson in the course
    const lesson = course.lessons.find(
      (lesson) => lesson.id.toString() === lessonId
    );

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Return the lesson content
    res.status(200).json({ lesson });
  }
);

// mark lesson as complete
export const markLessonComplete = handleAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { courseId, lessonId } = req.params;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is enrolled in the course
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const enrolledCourses = user.enrolledCourses as mongoose.Types.ObjectId[];
    if (
      !enrolledCourses.some((id) =>
        id.equals(new mongoose.Types.ObjectId(courseId))
      )
    ) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    // Find the lesson in the course
    const lesson = course.lessons.find(
      (lesson) => lesson.id.toString() === lessonId
    );

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Mark the lesson as complete
    lesson.completed = true;
    await course.save();

    // Update user progress
    course.progress += 1;
    course.completedLessons.push(lessonId);
    await course.save();

    res.status(200).json({ message: "Lesson marked as complete" });
  }
);
