import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../middleware/auth.middleware";
import { handleAsync } from "../utils/handler";
import Assessment from "../models/assessment.models";
import User from "../models/user.model";
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

// get assesment for user enrolled course
export const getAssessmentForUser = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get enrolled courses ids
    const enrolledCourses = user.enrolledCourses;

    // Find assessments for enrolled courses
    const assessment = await Assessment.find({
      course: { $in: enrolledCourses },
    }).populate("course", "title");

    // Return empty array instead of 404 if no assessments found
    if (!assessment || assessment.length === 0) {
      return res.status(200).json({ assessment: [] });
    }

    // Transform the data to match the expected format in the frontend
    const formattedAssessments = assessment.map((item) => ({
      ...item.toObject(),
      course: {
        _id: item.course?._id || "",
      },
    }));

    res.status(200).json({ assessment: formattedAssessments });
  }
);

// get question by id
export const getQuestion = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    // Find the assessment to get its questions
    const assessment = await Assessment.findById(id)
      .populate("questions")
      .populate("course", "title")
      .lean();

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // Check if user is enrolled in the course
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is enrolled in the course that this assessment belongs to
    let isEnrolled = false;

    if (Array.isArray(user.enrolledCourses)) {
      isEnrolled = user.enrolledCourses.some(
        (courseId) => courseId.toString() === assessment.course._id.toString()
      );
    }

    if (!isEnrolled) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    // Return all questions for the assessment
    res
      .status(200)
      .json({ questions: assessment.questions, course: assessment.course });
  }
);

// get results for an assessment submission
export const getAssessmentResults = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    // Check if user is authenticated using the correct property based on your auth middleware
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    try {
      // Find the assessment
      const assessment = await Assessment.findById(id)
        .populate("questions")
        .populate("course", "title")
        .lean();

      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // For testing purposes, we'll create a mock submission if none exists
      // In a real application, you should remove this and only show results for actual submissions
      const userSubmission = assessment.submissions?.find(
        (submission) => submission.userId.toString() === req.userId
      ) || {
        userId: req.userId,
        score: 80, // Sample score
        timeSpent: 1200, // Sample time spent (20 minutes)
        submittedAt: new Date(),
        answers: assessment.questions.map((q: any) => ({
          questionId: q._id,
          isCorrect: Math.random() > 0.3, // 70% chance of being correct for testing
          selectedAnswer: q.options ? q.options[0] : "Sample answer",
        })),
      };

      // Calculate results
      const totalQuestions = assessment.questions.length;
      const correctAnswers = userSubmission.answers.filter(
        (answer) => answer.isCorrect
      ).length;
      const incorrectAnswers = totalQuestions - correctAnswers;
      const score = userSubmission.score;
      const percentage = (score / totalQuestions) * 100;
      const isPassed = percentage >= assessment.passingScore;

      // Group questions by correct/incorrect
      const questionResults = assessment.questions.map((question: any) => {
        const userAnswer = userSubmission.answers.find(
          (a) => a.questionId.toString() === question._id.toString()
        );

        return {
          id: question._id,
          text: question.text,
          type: question.type,
          userAnswer: userAnswer?.selectedAnswer || [],
          correctAnswer:
            question.correctAnswer || question.correctAnswers || [],
          isCorrect: userAnswer?.isCorrect || false,
          category: question.category || "general",
        };
      });

      // Calculate strengths and weaknesses based on categories
      const categoriesMap: Record<string, { total: number; correct: number }> =
        {};

      questionResults.forEach((q) => {
        // Get the category from the question
        const category = q.category;
        if (!categoriesMap[category]) {
          categoriesMap[category] = { total: 0, correct: 0 };
        }
        categoriesMap[category].total++;
        if (q.isCorrect) {
          categoriesMap[category].correct++;
        }
      });

      const strengths: string[] = [];
      const weaknesses: string[] = [];

      Object.entries(categoriesMap).forEach(([category, stats]) => {
        const categoryScore = (stats.correct / stats.total) * 100;
        if (categoryScore >= 70) {
          strengths.push(category);
        } else if (categoryScore < 50) {
          weaknesses.push(category);
        }
      });

      // Generate recommendations based on weaknesses
      const recommendations: string[] = weaknesses.map(
        (w) => `Review concepts related to ${w}`
      );

      // Prepare the response
      const results = {
        assessmentId: assessment._id,
        title: assessment.title,
        courseTitle: assessment.course || "No course",
        submittedAt: userSubmission.submittedAt,
        timeSpent: userSubmission.timeSpent, // in seconds
        score,
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        percentage,
        isPassed,
        passingScore: assessment.passingScore,
        questions: questionResults,
        performance: {
          strengths,
          weaknesses,
          recommendations,
        },
      };

      return res.status(200).json(results);
    } catch (error) {
      // The handleAsync utility should catch this, but adding as a safeguard
      console.error("Error getting assessment results:", error);
      return res.status(500).json({ message: "Server error" });
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
