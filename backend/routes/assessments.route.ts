import express, { Request, Response, NextFunction } from "express";
import {
  GetAssessment,
  GetAssessmentById,
  StartAssessment,
  SubmitAssessment,
  GetAssessmentResults,
  CreateAssessment,
} from "../controllers/assessment.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.get("/", GetAssessment);
router.get("/:id", GetAssessmentById);

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
router.get(
  "/:id/results",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    GetAssessmentResults(req, res, next)
);

router.post(
  "/create",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    CreateAssessment(req, res, next)
);

export default router;
