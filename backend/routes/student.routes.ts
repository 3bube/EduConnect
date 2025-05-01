import express, { Response } from "express";
import { authMiddleware, ExtendedRequest } from "../middleware/auth.middleware";
import {
  getStudentDashboard,
  getEnrolledCoursesProgress,
  getUpcomingAssignmentsController,
  getRecommendedCoursesController,
  getUpcomingClassesController,
  updateLessonProgress,
  updateAssignmentProgress,
  updateTimeSpent,
  createDemoCourseProgress,
  getLearningStatsController,
} from "../controllers/student.controller";
import { handleAsync } from "../utils/handler";
import Course from "../models/course.model";
import { getUserCourseProgress } from "../utils/progress.utils";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Student dashboard routes
router.get("/dashboard", getStudentDashboard);
router.get("/courses/enrolled", getEnrolledCoursesProgress);
router.get("/assessments/upcoming", getUpcomingAssignmentsController);
router.get("/courses/recommended", getRecommendedCoursesController);
router.get("/classes/upcoming", getUpcomingClassesController);
router.get("/stats", getLearningStatsController);
router.post("/demo-progress", createDemoCourseProgress);
router.post(
  "/courses/:courseId/lessons/:lessonId/progress",
  updateLessonProgress
);
router.post(
  "/courses/:courseId/assignments/:assignmentId/progress",
  updateAssignmentProgress
);
router.post("/courses/:courseId/time-spent", updateTimeSpent);
// Create a controller function to handle course progress retrieval
const getCourseProgress = handleAsync(
  async (req: ExtendedRequest, res: Response) => {
    const { courseId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Get the user's progress for this course
      const progress = await getUserCourseProgress(userId, courseId);
      
      // Get the course to determine total lessons
      const course = await Course.findById(courseId);
      const totalLessons = course?.lessons?.length || 0;
      
      if (!progress) {
        return res.status(200).json({
          progress: {
            courseId,
            completedLessonsCount: 0,
            totalLessons,
            progressPercentage: 0,
            timeSpent: 0,
            completedLessons: [],
          },
        });
      }

      res.status(200).json({
        progress: {
          courseId: progress.courseId,
          completedLessonsCount: progress.completedLessons.length,
          totalLessons,
          progressPercentage: progress.progress,
          timeSpent: progress.timeSpent,
          completedLessons: progress.completedLessons,
          lastAccessed: progress.lastAccessed,
        },
      });
    } catch (error) {
      console.error("Error retrieving course progress:", error);
      res.status(500).json({
        message: "Failed to retrieve course progress",
        error: (error as Error).message,
      });
    }
  }
);

// Add the new route
router.get("/courses/:courseId/progress", getCourseProgress);

router.get("/courses/:courseId/lessons/:lessonId/progress", (req, res) => {
  // Placeholder for lesson progress retrieval
  res.status(200).json({ message: "Lesson progress retrieved successfully" });
});
router.get(
  "/courses/:courseId/assignments/:assignmentId/progress",
  (req, res) => {
    // Placeholder for assignment progress retrieval
    res
      .status(200)
      .json({ message: "Assignment progress retrieved successfully" });
  }
);
router.get("/courses/:courseId/time-spent", (req, res) => {
  // Placeholder for time spent retrieval
  res.status(200).json({ message: "Time spent retrieved successfully" });
});

export default router;
