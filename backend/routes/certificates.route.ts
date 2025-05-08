import express, { Request, Response, NextFunction } from "express";
import {
  generateCertificate,
  getUserCertificates,
  getCertificateById,
  verifyCertificate,
  generateCertificateFromAssessment
} from "../controllers/certificate.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Generate a certificate
router.post(
  "/generate",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    generateCertificate(req, res, next)
);

// Get all certificates for the logged-in user
router.get(
  "/",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    getUserCertificates(req, res, next)
);

// Get a specific certificate
router.get(
  "/:id",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    getCertificateById(req, res, next)
);

// Generate a certificate for a specific assessment submission
router.post(
  "/generate-from-assessment/:assessmentId", 
  authMiddleware, 
  generateCertificateFromAssessment
);

// Public route to verify certificate by credential ID
router.get("/verify/:credentialId", verifyCertificate);

export default router;
