import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { handleAsync } from "../utils/handler";
import Assessment from "../models/assessment.models";

export const GetAssessment = handleAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { status, category, search, page = "1", limit = "10" } = req.query;

    const query: any = { userId: req.user.id };

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: "i" } },
        { description: { $regex: search as string, $options: "i" } },
      ];
    }

    // Ensure pagination values are valid numbers
    const pageNum = Number.isNaN(parseInt(page as string))
      ? 1
      : parseInt(page as string);
    const limitNum = Number.isNaN(parseInt(limit as string))
      ? 10
      : parseInt(limit as string);

    const total = await Assessment.countDocuments(query);
    const assessments = await Assessment.find(query)
      .sort({ createdAt: -1 }) // Sort by latest created assessments
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(); // Optimize response

    return res.status(200).json({
      assessments,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  }
);

// Get assessment by id
export const GetAssessmentById = handleAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.status(200).json({ assessment });
  }
);

// Start assessment
export const StartAssessment = handleAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.status(200).json({ assessment });
  }
);

// Submit assessment
export const SubmitAssessment = handleAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { answers, timeSpent } = req.body;
    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // Save the submission details to the assessment or to a related model
    assessment.submissions.push({ userId: req.user.id, answers, timeSpent });
    await assessment.save();

    res.status(200).json({
      success: true,
      message: "Assessment submitted successfully",
      redirectUrl: `/assessments/${id}/results`,
    });
  }
);

// Get assessment results
export const GetAssessmentResults = handleAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.status(200).json({ assessment });
  }
);
