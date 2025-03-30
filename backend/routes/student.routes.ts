import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getStudentDashboard,
  getEnrolledCoursesProgress,
  getUpcomingAssignmentsController,
  getRecommendedCoursesController,
  getUpcomingClassesController,
  getLearningStatsController,
} from "../controllers/student.controller";

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

export default router;
