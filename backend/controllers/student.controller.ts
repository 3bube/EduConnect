import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Course from "../models/course.model";
import User from "../models/user.model";
import Assessment from "../models/assessment.models";
import { ExtendedRequest } from "../middleware/auth.middleware";
import { handleAsync } from "../utils/handler";

// Get student dashboard data
export const getStudentDashboard = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get user data
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the enrolled courses for user
    const enrolledCourses = await User.findById(req.userId).populate({
      path: "enrolledCourses",
      model: Course,
    });

    console.log(enrolledCourses);

    // Get upcoming assignments
    const upcomingAssignments = await getUpcomingAssignments(req.userId);

    // Get upcoming classes (if applicable)
    const upcomingClasses = await getUpcomingClasses(req.userId);

    // Get recommended courses
    const recommendedCourses = await getRecommendedCourses(req.userId);

    // Get learning stats
    const stats = await getLearningStats(req.userId);

    res.status(200).json({
      enrolledCourses: enrolledCourses?.enrolledCourses,
      upcomingAssignments,
      upcomingClasses,
      recommendedCourses,
      stats,
    });
  }
);

// Get enrolled courses with progress
export const getEnrolledCoursesProgress = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    console.log(req.userId);
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const courses = await getEnrolledCoursesWithProgress(req.userId);
    res.status(200).json({ courses });
  }
);

// Get upcoming assignments
export const getUpcomingAssignmentsController = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const assignments = await getUpcomingAssignments(req.userId);
    res.status(200).json({ assignments });
  }
);

// Get recommended courses
export const getRecommendedCoursesController = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const courses = await getRecommendedCourses(req.userId);
    res.status(200).json({ courses });
  }
);

// Get upcoming classes
export const getUpcomingClassesController = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const classes = await getUpcomingClasses(req.userId);
    res.status(200).json({ classes });
  }
);

// Get learning stats
export const getLearningStatsController = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const stats = await getLearningStats(req.userId);
    res.status(200).json({ stats });
  }
);

// Helper functions
async function getEnrolledCoursesWithProgress(userId: string) {
  // Find user to get enrolled courses
  const user = await User.findById(userId);
  if (!user || !user.enrolledCourses || user.enrolledCourses.length === 0) {
    return [];
  }

  // Get enrolled course IDs
  const enrolledCourseIds = user.enrolledCourses as mongoose.Types.ObjectId[];

  console.log(enrolledCourseIds);

  // Find courses with those IDs
  const courses = await Course.find({
    _id: { $in: enrolledCourseIds },
  });

  // Calculate progress for each course
  return courses.map((course) => {
    // Find user progress for this course (could be stored in a separate collection)
    // For now, we'll generate mock progress data
    const totalLessons = course.lessons?.length || 1;
    const completedLessons = Math.floor(Math.random() * totalLessons); // Mock data
    const progress = Math.round((completedLessons / totalLessons) * 100);

    // Find next lesson
    let nextLesson = null;
    if (course.lessons && course.lessons.length > completedLessons) {
      const nextLessonData = course.lessons[completedLessons];
      nextLesson = {
        id: nextLessonData.id,
        title: nextLessonData.title,
      };
    }

    return {
      _id: course._id,
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      price: course.price,
      duration: course.duration,
      image: course.image,
      instructor: course.instructor,
      tags: course.tags,
      lessons: course.lessons,
      progress,
      completedLessons,
      nextLesson,
    };
  });
}

async function getUpcomingAssignments(userId: string) {
  // Get user's enrolled courses
  const user = await User.findById(userId);
  if (!user || !user.enrolledCourses || user.enrolledCourses.length === 0) {
    return [];
  }

  // Get enrolled course IDs
  const enrolledCourseIds = user.enrolledCourses as mongoose.Types.ObjectId[];

  // Find assessments for those courses with due dates in the future
  const now = new Date();
  const assessments = await Assessment.find({
    courseId: { $in: enrolledCourseIds },
    dueDate: { $gt: now },
  })
    .sort({ dueDate: 1 })
    .limit(5);

  // Get course info for each assessment
  const assessmentData = [];
  for (const assessment of assessments) {
    const course = await Course.findById(assessment.course);

    assessmentData.push({
      id: assessment._id,
      title: assessment.title,
      courseId: assessment.course,
      courseName: course ? course.title : "Unknown Course",
      dueDate: assessment.dueDate,
      status: "pending", // Could be "completed" or "overdue" based on user's submission status
    });
  }

  return assessmentData;
}

async function getUpcomingClasses(userId: string) {
  // This would connect to a live class scheduling system
  // For now, return mock data
  return [
    {
      id: "class-1",
      title: "Introduction to Algebra",
      courseId: "course-123",
      courseName: "Mathematics 101",
      startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      endTime: new Date(Date.now() + 86400000 + 5400000).toISOString(), // Tomorrow + 1.5 hours
      tutor: "Dr. Smith",
    },
    {
      id: "class-2",
      title: "Advanced Programming Concepts",
      courseId: "course-456",
      courseName: "Computer Science Fundamentals",
      startTime: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      endTime: new Date(Date.now() + 172800000 + 5400000).toISOString(), // Day after tomorrow + 1.5 hours
      tutor: "Prof. Johnson",
    },
  ];
}

async function getRecommendedCourses(userId: string) {
  // Get user's enrolled courses to exclude them
  const user = await User.findById(userId);
  if (!user) {
    return [];
  }

  // Get enrolled course IDs to exclude
  const enrolledCourseIds = (user.enrolledCourses ||
    []) as mongoose.Types.ObjectId[];

  // Find courses not enrolled in, possibly filtered by user's interests or popular courses
  const recommendedCourses = await Course.find({
    _id: { $nin: enrolledCourseIds },
  }).limit(3);

  return recommendedCourses;
}

async function getLearningStats(userId: string) {
  // Get user's enrolled courses
  const user = await User.findById(userId);
  if (!user || !user.enrolledCourses || user.enrolledCourses.length === 0) {
    return {
      overallCompletion: 0,
      coursesEnrolled: 0,
      hoursStudied: 0,
      assignmentsCompleted: 0,
      totalAssignments: 0,
    };
  }

  // Get enrolled course IDs
  const enrolledCourseIds = user.enrolledCourses as mongoose.Types.ObjectId[];
  const coursesEnrolled = enrolledCourseIds.length;

  // Calculate overall completion (mock data for now)
  // In a real app, you would track user progress in each course
  const overallCompletion = Math.floor(Math.random() * 100);

  // Mock hours studied
  const hoursStudied = Math.floor(Math.random() * 50) + 10;

  // Mock assignments data
  const totalAssignments = Math.floor(Math.random() * 20) + 5;
  const assignmentsCompleted = Math.floor(Math.random() * totalAssignments);

  return {
    overallCompletion,
    coursesEnrolled,
    hoursStudied,
    assignmentsCompleted,
    totalAssignments,
  };
}
