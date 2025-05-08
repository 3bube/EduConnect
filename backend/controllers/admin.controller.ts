import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import Course from "../models/course.model";

// Fetch all users
export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
}

// Create a user
export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    const newUser = new User({
      name,
      email,
      password, // Should hash in production
      role,
      createdAt: new Date(),
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
}

// Delete a user
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const result = await User.deleteOne({ _id: new mongoose.Types.ObjectId(userId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}

// Delete a course
export async function deleteCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params;
    const result = await Course.deleteOne({ _id: new mongoose.Types.ObjectId(courseId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
}

// Update course (e.g., featured)
export async function updateCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params;
    const { featured } = req.body;
    const result = await Course.updateOne(
      { _id: new mongoose.Types.ObjectId(courseId) },
      { $set: { featured } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Course not found" });
    }
    const updatedCourse = await Course.findById(courseId);
    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
}

// Get all lessons
export async function getAllLessons(req: Request, res: Response, next: NextFunction) {
  try {
    const lessons = await req.app.locals.db.collection("lessons").find({}).toArray();
    res.json(lessons);
  } catch (error) {
    next(error);
  }
}
