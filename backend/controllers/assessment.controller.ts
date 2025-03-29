import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../middleware/auth.middleware";
import { handleAsync } from "../utils/handler";
import Assessment from "../models/assessment.models";
import Question from "../models/question.models";
import { IAssessmentAnswer } from "../interface/assessments.interface";
import { IQuestion } from "../models/question.models";
import mongoose from "mongoose";

export const GetAssessment = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
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
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
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
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
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
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { answers, timeSpent } = req.body;
    const assessmentId = req.params.id;

    const assessment = await Assessment.findById(assessmentId)
      .populate<{
        questions: (IQuestion & { _id: mongoose.Types.ObjectId })[];
      }>("questions")
      .exec();

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // Calculate score based on correct answers
    const gradedAnswers: IAssessmentAnswer[] = answers.map((answer: any) => {
      const question = assessment.questions.find(
        (q) => q._id.toString() === answer.questionId
      );

      if (!question) {
        return {
          questionId: new mongoose.Types.ObjectId(answer.questionId),
          selectedAnswer: answer.selectedAnswer,
          selectedAnswers: answer.selectedAnswers,
          isCorrect: false,
        };
      }

      const isCorrect =
        question.type === "multiple-select"
          ? arraysEqual(
              question.correctAnswers || [],
              answer.selectedAnswers || []
            )
          : question.correctAnswer === answer.selectedAnswer;

      return {
        questionId: question._id,
        selectedAnswer: answer.selectedAnswer,
        selectedAnswers: answer.selectedAnswers,
        isCorrect,
      };
    });

    const score =
      (gradedAnswers.filter((a) => a.isCorrect).length /
        assessment.questions.length) *
      100;

    // Add submission
    assessment.submissions.push({
      userId: req.user.id,
      answers: gradedAnswers,
      timeSpent,
      score,
      submittedAt: new Date(),
    });

    await assessment.save();

    res.status(200).json({
      message: "Assessment submitted successfully",
      score,
      totalQuestions: assessment.questions.length,
      correctAnswers: gradedAnswers.filter((a) => a.isCorrect).length,
    });
  }
);

// Get assessment results
export const GetAssessmentResults = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
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

// Create assessment
export const CreateAssessment = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const {
        title,
        description,
        type,
        questions: questionData,
        timeLimit = 60,
        dueDate,
        status,
        passingScore = 70,
        category = "General",
        courseId,
      } = req.body;

      console.log("course", courseId);
      // First, create all the questions
      const questionIds = [];

      for (const question of questionData) {
        // Transform options from {id, text} format to string array
        const options = question.options.map((opt: any) => opt.text);

        const newQuestion = new Question({
          type: question.type,
          text: question.text,
          options,
          correctAnswer: question.correctAnswer,
          correctAnswers: question.correctAnswers,
        });

        const savedQuestion = await newQuestion.save();
        questionIds.push(savedQuestion._id);
      }

      // Create the assessment with the question IDs
      const assessment = new Assessment({
        title,
        description,
        type,
        questions: questionIds,
        timeLimit,
        dueDate,
        status,
        passingScore,
        category,
        course: courseId,
      });

      console.log("Assessments", assessment);

      await assessment.save();

      console.log("Saved");

      res.status(201).json({
        message: "Assessment created successfully",
        assessment: {
          id: assessment._id,
          title: assessment.title,
          description: assessment.description,
          type: assessment.type,
          status: assessment.status,
          questionCount: questionIds.length,
        },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Helper function to compare arrays
function arraysEqual(a: any[], b: any[]) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return (
    a.every((item) => b.includes(item)) && b.every((item) => a.includes(item))
  );
}
