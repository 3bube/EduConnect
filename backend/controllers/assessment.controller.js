"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssessmentResults = exports.getQuestion = exports.getAssessmentForUser = exports.CreateAssessment = exports.GetAssessmentResults = exports.SubmitAssessment = exports.StartAssessment = exports.GetAssessmentById = exports.GetAssessment = void 0;
const handler_1 = require("../utils/handler");
const assessment_models_1 = __importDefault(require("../models/assessment.models"));
const user_model_1 = __importDefault(require("../models/user.model"));
const question_models_1 = __importDefault(require("../models/question.models"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.GetAssessment = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { status, category, search, page = "1", limit = "10" } = req.query;
    const query = { userId: req.userId };
    if (status)
        query.status = status;
    if (category)
        query.category = category;
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }
    // Ensure pagination values are valid numbers
    const pageNum = Number.isNaN(parseInt(page))
        ? 1
        : parseInt(page);
    const limitNum = Number.isNaN(parseInt(limit))
        ? 10
        : parseInt(limit);
    const total = yield assessment_models_1.default.countDocuments(query);
    const assessments = yield assessment_models_1.default.find(query)
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
}));
// Get assessment by id
exports.GetAssessmentById = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    const assessment = yield assessment_models_1.default.findById(id);
    if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
    }
    res.status(200).json({ assessment });
}));
// Start assessment
exports.StartAssessment = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    const assessment = yield assessment_models_1.default.findById(id);
    if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
    }
    res.status(200).json({ assessment });
}));
// Submit assessment
exports.SubmitAssessment = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { answers, timeSpent } = req.body;
    const assessmentId = req.params.id;
    // Find assessment with populated questions
    const assessment = yield assessment_models_1.default.findById(assessmentId)
        .populate("questions")
        .exec();
    if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
    }
    // Convert answers object to array format if needed
    const answersArray = Array.isArray(answers)
        ? answers
        : Object.entries(answers).map(([questionId, selectedAnswer]) => ({
            questionId,
            selectedAnswer,
        }));
    // Grade each answer
    const gradedAnswers = assessment.questions.map((question) => {
        var _a;
        const userAnswer = answersArray.find((a) => a.questionId === question._id.toString());
        if (!userAnswer) {
            return {
                questionId: question._id,
                isCorrect: false,
                selectedAnswer: null,
                selectedAnswers: [],
            };
        }
        let isCorrect = false;
        console.log("here1");
        switch (question.type) {
            case "multiple-select":
                // Handle case where answers might be in object format
                const userSelections = Array.isArray(userAnswer.selectedAnswers)
                    ? userAnswer.selectedAnswers
                    : Object.values(userAnswer.selectedAnswers || {});
                isCorrect = arraysEqual(((_a = question.correctAnswers) === null || _a === void 0 ? void 0 : _a.sort()) || [], userSelections.sort());
                break;
            case "multiple-choice":
            case "true-false":
                isCorrect = question.correctAnswer === userAnswer.selectedAnswer;
                break;
            default:
                isCorrect = false;
        }
        return {
            questionId: question._id,
            isCorrect,
            selectedAnswer: userAnswer.selectedAnswer,
            selectedAnswers: Array.isArray(userAnswer.selectedAnswers)
                ? userAnswer.selectedAnswers
                : [userAnswer.selectedAnswer].filter(Boolean),
        };
    });
    // Calculate score
    const correctCount = gradedAnswers.filter((a) => a.isCorrect).length;
    const totalQuestions = assessment.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const isPassed = score >= assessment.passingScore;
    // Create submission
    const submission = {
        userId: new mongoose_1.default.Types.ObjectId(req.userId),
        answers: gradedAnswers,
        timeSpent, // in seconds
        score,
        submittedAt: new Date(),
    };
    // Update assessment
    assessment.submissions.push(submission);
    assessment.status = "completed";
    yield assessment.save();
    console.log("here2");
    // Prepare response data
    const response = {
        message: "Assessment submitted successfully",
        assessmentId: assessment._id,
        score,
        totalQuestions,
        correctAnswers: correctCount,
        incorrectAnswers: totalQuestions - correctCount,
        percentage: score,
        isPassed,
        passingScore: assessment.passingScore,
        timeSpent,
        submittedAt: submission.submittedAt,
    };
    console.log("response", response);
    res.status(200).json(response);
}));
// Get assessment results
exports.GetAssessmentResults = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    const assessment = yield assessment_models_1.default.findById(id);
    if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
    }
    res.status(200).json({ assessment });
}));
// Create assessment
exports.CreateAssessment = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const { title, description, type, questions: questionData, timeLimit = 60, dueDate, status, passingScore = 70, category = "General", courseId, } = req.body;
        console.log("course", courseId);
        // First, create all the questions
        const questionIds = [];
        for (const question of questionData) {
            // Transform options from {id, text} format to string array
            const options = question.options.map((opt) => opt.text);
            const newQuestion = new question_models_1.default({
                type: question.type,
                text: question.text,
                options,
                correctAnswer: question.correctAnswer,
                correctAnswers: question.correctAnswers,
            });
            const savedQuestion = yield newQuestion.save();
            questionIds.push(savedQuestion._id);
        }
        // Create the assessment with the question IDs
        const assessment = new assessment_models_1.default({
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
        yield assessment.save();
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
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// get assesment for user enrolled course
exports.getAssessmentForUser = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const user = yield user_model_1.default.findById(req.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // Get enrolled courses ids
    const enrolledCourses = user.enrolledCourses;
    // Find assessments for enrolled courses
    const assessment = yield assessment_models_1.default.find({
        course: { $in: enrolledCourses },
    }).populate("course");
    // Return empty array instead of 404 if no assessments found
    if (!assessment || assessment.length === 0) {
        return res.status(200).json({ assessment: [] });
    }
    // Transform the data to match the expected format in the frontend
    const formattedAssessments = assessment.map((item) => {
        var _a;
        return (Object.assign(Object.assign({}, item.toObject()), { course: {
                _id: ((_a = item.course) === null || _a === void 0 ? void 0 : _a._id) || "",
            } }));
    });
    res.status(200).json({ assessment: formattedAssessments });
}));
// get question by id
exports.getQuestion = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    // Find the assessment to get its questions
    const assessment = yield assessment_models_1.default.findById(id)
        .populate("questions")
        .populate("course", "title")
        .lean();
    if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
    }
    // Check if user is enrolled in the course
    const user = yield user_model_1.default.findById(req.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // Check if the user is enrolled in the course that this assessment belongs to
    let isEnrolled = false;
    if (Array.isArray(user.enrolledCourses)) {
        isEnrolled = user.enrolledCourses.some((courseId) => courseId.toString() === assessment.course._id.toString());
    }
    if (!isEnrolled) {
        return res.status(403).json({ message: "Not enrolled in this course" });
    }
    // Return all questions for the assessment
    res
        .status(200)
        .json({ questions: assessment.questions, course: assessment.course });
}));
// get results for an assessment submission
exports.getAssessmentResults = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    console.log("results for", req.userId);
    try {
        // Find the assessment with populated questions and submissions
        const assessment = yield assessment_models_1.default.findById(id)
            .populate({
            path: "questions",
            select: "text type options correctAnswer category",
        })
            .populate("course", "title")
            .lean();
        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }
        console.log("assessment found");
        // Find the user's actual submission
        const userSubmission = (_a = assessment.submissions) === null || _a === void 0 ? void 0 : _a.find((submission) => submission.userId.toString() === req.userId);
        console.log("user submission found");
        if (!userSubmission) {
            return res.status(404).json({ message: "Submission not found" });
        }
        // Calculate actual results
        const totalQuestions = assessment.questions.length;
        const correctAnswers = userSubmission.answers.reduce((count, answer) => (answer.isCorrect ? count + 1 : count), 0);
        const incorrectAnswers = totalQuestions - correctAnswers;
        const percentage = (correctAnswers / totalQuestions) * 100;
        const isPassed = percentage >= assessment.passingScore;
        // Map question results with actual correct answers
        const questionResults = assessment.questions.map((question) => {
            const userAnswer = userSubmission.answers.find((a) => a.questionId.toString() === question._id.toString());
            return {
                id: question._id,
                text: question.text,
                type: question.type,
                userAnswer: (userAnswer === null || userAnswer === void 0 ? void 0 : userAnswer.selectedAnswer) || (userAnswer === null || userAnswer === void 0 ? void 0 : userAnswer.selectedAnswers) || [],
                correctAnswer: question.correctAnswer,
                isCorrect: (userAnswer === null || userAnswer === void 0 ? void 0 : userAnswer.isCorrect) || false,
                category: question.category || "general",
            };
        });
        // Calculate performance metrics
        const categoriesMap = questionResults.reduce((acc, q) => {
            const category = q.category;
            if (!acc[category]) {
                acc[category] = { total: 0, correct: 0 };
            }
            acc[category].total++;
            if (q.isCorrect)
                acc[category].correct++;
            return acc;
        }, {});
        const strengths = [];
        const weaknesses = [];
        Object.entries(categoriesMap).forEach(([category, stats]) => {
            const categoryScore = (stats.correct / stats.total) * 100;
            if (categoryScore >= 70)
                strengths.push(category);
            if (categoryScore < 50)
                weaknesses.push(category);
        });
        // Prepare final response
        const results = {
            assessmentId: assessment._id,
            title: assessment.title,
            courseTitle: assessment.course || "No course",
            submittedAt: userSubmission.submittedAt,
            timeSpent: userSubmission.timeSpent,
            score: correctAnswers, // Actual score based on correct answers
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
                recommendations: weaknesses.map((w) => `Review concepts related to ${w}`),
            },
        };
        return res.status(200).json(results);
    }
    catch (error) {
        console.error("Error getting assessment results:", error);
        return res.status(500).json({ message: "Server error" });
    }
}));
// Helper function to compare arrays
function arraysEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b))
        return false;
    if (a.length !== b.length)
        return false;
    return (a.every((item) => b.includes(item)) && b.every((item) => a.includes(item)));
}
