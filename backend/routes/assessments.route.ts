import express, { Request, Response, NextFunction } from "express";
import {
  GetAssessment,
  GetAssessmentById,
  GetAssessmentStatus,
  StartAssessment,
  SubmitAssessment,
  getAssessmentForUser,
  CreateAssessment,
  getAssessmentResults,
  getQuestion,
  getTutorAssessments,
} from "../controllers/assessment.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.get("/", GetAssessment);

// User-specific assessments route - must come before /:id to avoid being treated as an ID parameter
router.get(
  "/user",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    getAssessmentForUser(req, res, next)
);

// Get all assessments created by a tutor
router.get("/tutor/:tutorId", getTutorAssessments);

// Assessment by ID route
router.get("/:id", authMiddleware, GetAssessmentById);

// Get questions for an assessment
router.get("/:id/questions", authMiddleware, getQuestion);

// Get assessment status
router.get("/:id/status", authMiddleware, GetAssessmentStatus);

// Get assessment results
router.get("/:id/results", authMiddleware, getAssessmentResults);

// Protected routes - require authentication
router.post(
  "/:id/start",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    StartAssessment(req, res, next)
);
router.post(
  "/:id/submit",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    SubmitAssessment(req, res, next)
);

router.post(
  "/create",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    CreateAssessment(req, res, next)
);

router.get(
  "/:id/question",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    getQuestion(req, res, next)
);

export default router;
