import { Request, Response, NextFunction } from "express";
import Certificate from "../models/certificate.model";
import User from "../models/user.model";
import Assessment from "../models/assessment.models";
import { ExtendedRequest } from "../middleware/auth.middleware";
import { handleAsync } from "../utils/handler";
import mongoose from "mongoose";

// Generate a certificate upon successful assessment completion
export const generateCertificate = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { assessmentId, courseId } = req.body;

    if (!assessmentId || !courseId) {
      return res.status(400).json({
        message: "Assessment ID and Course ID are required",
      });
    }

    try {
      // Check if user has already earned this certificate
      const existingCertificate = await Certificate.findOne({
        userId: req.userId,
        assessmentId,
        courseId,
      });

      if (existingCertificate) {
        return res.status(200).json({
          message: "Certificate already exists",
          certificate: existingCertificate,
        });
      }

      // Verify the assessment exists and is completed
      const assessment = await Assessment.findById(assessmentId)
        .populate("questions")
        .populate("course", "title skills")
        .lean();

      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // Find the user's submission
      const userSubmission = assessment.submissions?.find(
        (submission) => submission.userId.toString() === req.userId
      );

      if (!userSubmission) {
        return res.status(400).json({
          message: "You haven't completed this assessment yet",
        });
      }

      // Check if user passed the assessment
      const totalQuestions = assessment.questions.length;
      const score = userSubmission.score;
      const percentage = (score / totalQuestions) * 100;
      const isPassed = percentage >= assessment.passingScore;

      if (!isPassed) {
        return res.status(400).json({
          message: "You need to pass the assessment to earn a certificate",
        });
      }

      // Determine the grade based on the percentage
      let grade = "F";
      if (percentage >= 90) grade = "A";
      else if (percentage >= 80) grade = "B";
      else if (percentage >= 70) grade = "C";
      else if (percentage >= 60) grade = "D";

      // Calculate expiry date (3 years from now)
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 3);

      // Create the certificate
      const certificate = new Certificate({
        title: assessment.title,
        issueDate: new Date(),
        expiryDate: expiryDate,
        userId: req.userId,
        courseId: courseId,
        assessmentId: assessmentId,
        issuer: "EduConnect",
        grade: grade,
        skills: assessment.course ? (assessment.course as any).skills || [] : [],
      });

      await certificate.save();

      // Add certificate to user's certificates array
      await User.findByIdAndUpdate(req.userId, {
        $push: { certificates: certificate._id },
      });

      res.status(201).json({
        message: "Certificate generated successfully",
        certificate,
      });
    } catch (error) {
      console.error("Error generating certificate:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all certificates for the logged-in user
export const getUserCertificates = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const certificates = await Certificate.find({ userId: req.userId })
        .populate("courseId", "title")
        .populate("assessmentId", "title")
        .sort({ issueDate: -1 });

      res.status(200).json({ certificates });
    } catch (error) {
      console.error("Error fetching certificates:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get a specific certificate by ID
export const getCertificateById = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    try {
      const certificate = await Certificate.findById(id)
        .populate("courseId", "title")
        .populate("assessmentId", "title")
        .populate("userId", "name email");

      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }

      // Check if certificate belongs to the user or user is admin
      if (
        certificate.userId.toString() !== req.userId 
        // Only allow the user who owns the certificate to access it
        // Admin check removed as userRole is not in ExtendedRequest
      ) {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      res.status(200).json({ certificate });
    } catch (error) {
      console.error("Error fetching certificate:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
