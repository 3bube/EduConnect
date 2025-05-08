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
exports.getTutorAssessments = exports.getDetailedAssessmentResults = exports.getAssessmentResults = exports.getQuestion = exports.getAssessmentForUser = exports.CreateAssessment = exports.GetAssessmentStatus = exports.SubmitAssessment = exports.StartAssessment = exports.GetAssessmentById = exports.GetAssessment = void 0;
const handler_1 = require("../utils/handler");
const assessment_models_1 = __importDefault(require("../models/assessment.models"));
const user_model_1 = __importDefault(require("../models/user.model"));
const question_models_1 = __importDefault(require("../models/question.models"));
const course_model_1 = __importDefault(require("../models/course.model"));
const certificate_model_1 = __importDefault(require("../models/certificate.model"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.GetAssessment = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { status, category, search, page = "1", limit = "10" } = req.query;
    const query = {};
    if (req.query.createdBy) {
        query.createdBy = req.query.createdBy;
    }
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
    console.log("req.userId", req.userId);
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    const assessment = yield assessment_models_1.default.findById(id)
        .populate('questions')
        .populate('course');
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
    // Check if user has already submitted this assessment
    const hasSubmitted = assessment.submissions.some((submission) => submission.user.toString() === req.userId);
    if (hasSubmitted) {
        return res.status(400).json({
            message: "You have already completed this assessment",
            status: "completed",
        });
    }
    // Update the assessment's status when user starts it
    const userStatusUpdate = {
        assessmentId: assessment._id,
        userId: req.userId,
        status: "in_progress",
        startedAt: new Date(),
    };
    // You might want to store this in a separate collection for user progress
    // For simplicity we'll just return the updated status
    res.status(200).json({
        assessment,
        userStatus: "in_progress",
        message: "Assessment started successfully",
    });
}));
// Submit assessment
exports.SubmitAssessment = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { answers, timeSpent } = req.body;
    const assessmentId = req.params.id;
    // console.log("Received submission:", { assessmentId, userId: req.userId, answers, timeSpent });
    // Find assessment with populated questions
    const assessment = yield assessment_models_1.default.findById(assessmentId)
        .populate("questions")
        .populate("course")
        .exec();
    if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
    }
    // Convert answers object to array format if needed
    const answersArray = Array.isArray(answers)
        ? answers
        : Object.entries(answers).map(([questionId, selectedAnswer]) => {
            // Log the raw answer for debugging
            console.log(`Processing raw answer for question ${questionId}:`, selectedAnswer);
            return {
                questionId,
                selectedAnswer,
                // If the selectedAnswer is an array, treat it as selectedAnswers
                selectedAnswers: Array.isArray(selectedAnswer) ? selectedAnswer : undefined
            };
        });
    // console.log("Processed answersArray:", answersArray);
    // Grade each answer
    const gradedAnswers = assessment.questions.map((question) => {
        const userAnswer = answersArray.find((a) => a.questionId === question._id.toString());
        if (!userAnswer) {
            console.log(`No answer found for question ${question._id}`);
            return {
                questionId: question._id,
                isCorrect: false,
                selectedAnswer: null,
                selectedAnswers: [],
            };
        }
        // Check if the answer is empty (skipped)
        const isEmptyAnswer = (!userAnswer.selectedAnswer || userAnswer.selectedAnswer === "") &&
            (!userAnswer.selectedAnswers || !Array.isArray(userAnswer.selectedAnswers) || userAnswer.selectedAnswers.length === 0);
        if (isEmptyAnswer) {
            // console.log(`Empty/skipped answer for question ${question._id}`);
            return {
                questionId: question._id,
                isCorrect: false,
                selectedAnswer: null,
                selectedAnswers: [],
            };
        }
        let isCorrect = false;
        // console.log(`Processing answer for question type: ${question.type}, ID: ${question._id}`);
        // console.log(`User answer:`, userAnswer);
        switch (question.type) {
            case "multiple-select":
                // Ensure selectedAnswers is always an array of strings
                let userSelections = [];
                // Handle different formats that might come from the client
                if (Array.isArray(userAnswer.selectedAnswers)) {
                    userSelections = userAnswer.selectedAnswers
                        .map((item) => 
                    // Flatten any nested arrays and convert to string
                    Array.isArray(item) ? item.map(String) : String(item))
                        .flat();
                }
                else if (userAnswer.selectedAnswers &&
                    typeof userAnswer.selectedAnswers === "object") {
                    // Handle object format like {0: "value1", 1: "value2"}
                    userSelections = Object.values(userAnswer.selectedAnswers).map(String);
                }
                else if (Array.isArray(userAnswer.selectedAnswer)) {
                    // Sometimes multiple selections come in selectedAnswer field
                    userSelections = userAnswer.selectedAnswer.map(String);
                }
                // console.log("User selections:", userSelections);
                // console.log("Correct answers:", question.correctAnswers);
                // Compare arrays after normalization
                isCorrect = arraysEqual((question.correctAnswers || []).map(String).sort(), userSelections.sort());
                break;
            case "multiple-choice":
            case "true-false":
                // Handle single selection
                const normalizedAnswer = Array.isArray(userAnswer.selectedAnswer)
                    ? String(userAnswer.selectedAnswer[0])
                    : String(userAnswer.selectedAnswer || "");
                isCorrect =
                    String(question.correctAnswer || "") === normalizedAnswer;
                // console.log(`Single-select answer comparison: User=${normalizedAnswer}, Correct=${question.correctAnswer}, isCorrect=${isCorrect}`);
                break;
            default:
                isCorrect = false;
        }
        // Normalize the answer format for storage
        let finalSelectedAnswer = null;
        let finalSelectedAnswers = [];
        if (question.type === "multiple-select") {
            // For multiple-select, store an array in selectedAnswers, null in selectedAnswer
            finalSelectedAnswers = userAnswer.selectedAnswers
                ? Array.isArray(userAnswer.selectedAnswers)
                    ? userAnswer.selectedAnswers.flat().map(String)
                    : Object.values(userAnswer.selectedAnswers).map(String)
                : Array.isArray(userAnswer.selectedAnswer)
                    ? userAnswer.selectedAnswer.map(String)
                    : [];
        }
        else {
            // For single-select, store a string in selectedAnswer, empty array in selectedAnswers
            finalSelectedAnswer = Array.isArray(userAnswer.selectedAnswer)
                ? String(userAnswer.selectedAnswer[0] || "")
                : String(userAnswer.selectedAnswer || "");
        }
        const result = {
            questionId: question._id,
            isCorrect,
            selectedAnswer: finalSelectedAnswer,
            selectedAnswers: finalSelectedAnswers,
        };
        // console.log(`Final answer for question ${question._id}:`, result);
        return result;
    });
    // Calculate score - add detailed logging
    const correctCount = gradedAnswers.filter((a) => a.isCorrect).length;
    const totalQuestions = assessment.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= assessment.passingScore;
    // console.log(`Score calculation details:`, {
    //   correctCount,
    //   totalQuestions,
    //   score,
    //   passingScore: assessment.passingScore,
    //   passed,
    //   gradedAnswersSummary: gradedAnswers.map(a => ({
    //     questionId: a.questionId,
    //     isCorrect: a.isCorrect,
    //     hasAnswer: a.selectedAnswer !== null || (a.selectedAnswers && a.selectedAnswers.length > 0)
    //   }))
    // });
    // Create submission with the correct structure
    const submission = {
        assessment: new mongoose_1.default.Types.ObjectId(assessmentId),
        user: new mongoose_1.default.Types.ObjectId(req.userId),
        userId: new mongoose_1.default.Types.ObjectId(req.userId), // Keep for backward compatibility with schema
        answers: gradedAnswers.map(answer => ({
            questionId: answer.questionId,
            selectedAnswer: answer.selectedAnswer,
            selectedAnswers: answer.selectedAnswers,
            isCorrect: answer.isCorrect
        })),
        timeSpent, // in seconds
        score,
        passed,
        startTime: new Date(Date.now() - timeSpent * 1000), // Approximate start time
        endTime: new Date(),
        _id: undefined,
        submittedAt: undefined
    };
    // Log the submission to verify structure
    // console.log("Submission being saved:", JSON.stringify({
    //   userId: submission.userId,
    //   score: submission.score,
    //   timeSpent: submission.timeSpent,
    //   answersCount: submission.answers.length,
    //   answerSample: submission.answers.length > 0 ? submission.answers[0] : null
    // }));
    // Update assessment
    assessment.submissions.push(submission);
    assessment.status = "completed";
    yield assessment.save();
    console.log("Assessment saved with status:", assessment.status);
    // If the user passed the assessment, check if they should receive a certificate
    let certificate = null;
    if (passed) {
        try {
            // Extract course ID correctly based on whether it's populated or not
            let courseId;
            if (typeof assessment.course === 'object' && assessment.course) {
                courseId = assessment.course._id;
                console.log(`Course object found, using ID: ${courseId}`);
            }
            else if (assessment.course) {
                courseId = assessment.course;
                console.log(`Course ID string found: ${courseId}`);
            }
            else if (assessment.course) {
                courseId = assessment.course;
                console.log(`Using courseId field: ${courseId}`);
            }
            else {
                console.error('No course ID found in assessment:', assessment._id);
                throw new Error('No course ID found for this assessment');
            }
            // console.log(`Attempting to generate certificate for course ${courseId} and user ${req.userId}`);
            // Get the course to extract skills for the certificate
            const courseObj = yield course_model_1.default.findById(courseId).lean();
            if (!courseObj) {
                console.error(`Could not find course with ID ${courseId}`);
                throw new Error(`Course not found: ${courseId}`);
            }
            // console.log(`Found course: ${courseObj.title}`);
            // Check if a certificate already exists
            const existingCertificate = yield certificate_model_1.default.findOne({
                userId: req.userId,
                courseId: courseObj._id,
                assessmentId: assessment._id,
            });
            if (existingCertificate) {
                console.log(`Certificate already exists: ${existingCertificate._id}, returning existing certificate`);
                certificate = existingCertificate;
            }
            else {
                console.log('Creating new certificate...');
                // Determine grade based on score
                let grade = "C";
                if (score >= 90)
                    grade = "A";
                else if (score >= 80)
                    grade = "B";
                else if (score >= 70)
                    grade = "C";
                else if (score >= 60)
                    grade = "D";
                else
                    grade = "F";
                // Get skills from course tags or default to empty array
                const skills = courseObj.tags || [];
                try {
                    // Create new certificate
                    certificate = new certificate_model_1.default({
                        userId: req.userId,
                        courseId: courseObj._id,
                        assessmentId: assessment._id,
                        title: `${courseObj.title} Certificate`,
                        issueDate: new Date(),
                        // Set expiry to 3 years from now
                        expiryDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000),
                        grade,
                        score,
                        skills,
                        issuer: "EduConnect",
                        status: "issued",
                    });
                    yield certificate.save();
                    console.log("Certificate created:", certificate._id);
                    console.log("Certificate details:", {
                        credentialId: certificate.credentialId,
                        title: certificate.title,
                        courseId: certificate.courseId
                    });
                    // Update user's certificates array
                    yield user_model_1.default.findByIdAndUpdate(req.userId, {
                        $addToSet: { certificates: certificate._id },
                    });
                    console.log(`Updated user ${req.userId} with new certificate`);
                }
                catch (saveError) {
                    console.error("Error saving certificate:", saveError);
                    if (saveError instanceof Error) {
                        console.error("Certificate save error details:", saveError.message);
                        console.error("Stack trace:", saveError.stack);
                    }
                    // Continue execution - don't re-throw the error
                }
            }
        }
        catch (certError) {
            console.error("Error creating certificate:", certError);
            // Log detailed error for debugging
            if (certError instanceof Error) {
                console.error("Certificate error details:", certError.message);
                console.error("Stack trace:", certError.stack);
            }
            // Even if certificate creation fails, we'll continue with the assessment submission
        }
    }
    else {
        console.log(`User did not pass assessment. Score: ${score}, Required: ${assessment.passingScore}`);
    }
    // Prepare response data
    const response = {
        message: "Assessment submitted successfully",
        assessmentId: assessment._id,
        score,
        totalQuestions,
        correctAnswers: correctCount,
        incorrectAnswers: totalQuestions - correctCount,
        percentage: score,
        passed,
        passingScore: assessment.passingScore,
        timeSpent,
        submittedAt: submission.endTime,
        certificate: certificate
            ? {
                id: certificate._id,
                title: certificate.title,
                credentialId: certificate.credentialId,
                issueDate: certificate.issueDate,
                grade: certificate.grade,
            }
            : null,
    };
    console.log("Response prepared:", response);
    res.status(200).json(response);
}));
// Get assessment status
exports.GetAssessmentStatus = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    var _a;
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const { title, description, type, questions: questionData, timeLimit = 60, dueDate, status, passingScore = 70, category = "General", courseId, } = req.body;
        // First, create all the questions
        const questionIds = [];
        for (const question of questionData) {
            // Accept frontend shape: { question: string, options: string[], correctAnswer: number }
            // Map to backend: { text, options, correctAnswer (string), type }
            const options = question.options;
            const correctAnswerIndex = (_a = question.correctAnswer) !== null && _a !== void 0 ? _a : 0;
            const correctAnswerValue = options[correctAnswerIndex];
            const type = "multiple-choice"; // Default for now, or extend if frontend sends type
            const newQuestion = new question_models_1.default({
                type,
                text: question.question,
                options,
                correctAnswer: correctAnswerValue,
            });
            const savedQuestion = yield newQuestion.save();
            questionIds.push(savedQuestion._id);
        }
        // Create the assessment with the question IDs
        // Accept status and category as sent from frontend, but ensure category is not empty
        const assessment = new assessment_models_1.default({
            title,
            description,
            type,
            questions: questionIds,
            timeLimit,
            dueDate,
            status, // Accept published/draft etc. from frontend
            passingScore,
            category: category && category.trim() !== '' ? category : 'General',
            course: courseId, // Accept 'courseId' as 'course'
            createdBy: req.userId, // Set the tutor as the creator
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
    console.log("Getting assessments for user:", req.userId);
    const user = yield user_model_1.default.findById(req.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // Get enrolled courses ids
    const enrolledCourses = user.enrolledCourses;
    console.log("User enrolled courses:", enrolledCourses);
    // Find assessments for enrolled courses
    const assessments = yield assessment_models_1.default.find({
        course: { $in: enrolledCourses },
    }).populate("course");
    console.log("Found assessments count:", assessments.length);
    // Return empty array instead of 404 if no assessments found
    if (!assessments || assessments.length === 0) {
        return res.status(200).json({ assessment: [] });
    }
    // Transform the data to match the expected format in the frontend
    const formattedAssessments = assessments.map((item) => {
        var _a, _b, _c;
        const assessment = item.toObject();
        // Check if user has submitted this assessment
        const userSubmission = (_a = assessment.submissions) === null || _a === void 0 ? void 0 : _a.find((submission) => { var _a; return ((_a = submission === null || submission === void 0 ? void 0 : submission.userId) === null || _a === void 0 ? void 0 : _a.toString()) === req.userId; });
        console.log(`Assessment ${assessment._id} - ${assessment.title} - Submission:`, userSubmission ?
            `Found (Score: ${userSubmission.score})` :
            "Not found");
        // Set status based on user's submission
        if (userSubmission) {
            assessment.status = "completed";
            assessment.userScore = userSubmission.score; // Store user's score separately
            assessment.averageScore = userSubmission.score;
            // assessment.completedDate = userSubmission.endTime || userSubmission.submittedAt;
        }
        else {
            assessment.status = "not_started";
        }
        return Object.assign(Object.assign({}, assessment), { course: {
                _id: ((_b = item.course) === null || _b === void 0 ? void 0 : _b._id) || "",
                title: ((_c = item.course) === null || _c === void 0 ? void 0 : _c.title) || "",
            } });
    });
    console.log("Formatted assessments:", formattedAssessments.map(a => ({
        id: a._id,
        title: a.title,
        status: a.status,
        score: a.passingScore,
        averageScore: a.averageScore
    })));
    res.status(200).json({ assessment: formattedAssessments });
}));
// get questions for an assessment
exports.getQuestion = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // In the getQuestion controller, we retrieve the assessment first
        const assessment = yield assessment_models_1.default.findById(id);
        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }
        // Extract question IDs from the assessment
        const questionIds = assessment.questions;
        if (!questionIds || questionIds.length === 0) {
            return res.status(404).json({ message: "No questions found for this assessment" });
        }
        // Fetch the questions by their IDs
        const questions = yield question_models_1.default.find({ _id: { $in: questionIds } });
        if (!questions || questions.length === 0) {
            return res.status(404).json({ message: "Questions not found" });
        }
        console.log(`Found ${questions.length} questions for assessment ${id}`);
        res.status(200).json({ questions });
    }
    catch (error) {
        console.error(`Error fetching questions for assessment ${id}:`, error);
        res.status(500).json({ message: "Error retrieving questions", error: error.message });
    }
}));
// Get assessment results
exports.getAssessmentResults = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = req.userId;
    try {
        const assessment = yield assessment_models_1.default.findById(id)
            .populate('questions')
            .populate('course');
        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }
        const userSubmission = (_a = assessment.submissions) === null || _a === void 0 ? void 0 : _a.find((sub) => { var _a; return ((_a = sub.userId) === null || _a === void 0 ? void 0 : _a.toString()) === userId; });
        if (!userSubmission) {
            const mockResult = {
                _id: "mock-" + Date.now(),
                assessmentId: id,
                userId: userId || 'guest-user',
                assessment: assessment,
                answers: assessment.questions.map((question) => ({
                    questionId: question._id,
                    selectedOption: question.correctAnswer,
                    isCorrect: true
                })),
                score: 100,
                passed: true,
                startTime: new Date(Date.now() - 1000 * 60 * 15),
                endTime: new Date(),
                totalTime: 900,
                certificate: {
                    _id: "cert-" + Date.now(),
                    credentialId: `CERT-${assessment.title.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
                }
            };
            return res.status(200).json({ result: mockResult });
        }
        const formattedAnswers = userSubmission.answers.map((answer) => {
            const isMultipleSelect = Array.isArray(answer.selectedAnswers) && answer.selectedAnswers.length > 0;
            return {
                questionId: answer.questionId,
                selectedOption: answer.selectedAnswer || "",
                selectedOptions: answer.selectedAnswers || [],
                isCorrect: answer.isCorrect
            };
        });
        // Calculate if user passed based on score and passing score
        const passed = userSubmission.score >= assessment.passingScore;
        const result = {
            _id: userSubmission._id ? userSubmission._id.toString() : `submission-${Date.now()}`,
            assessmentId: assessment._id,
            userId: userId,
            assessment: assessment,
            answers: formattedAnswers,
            score: userSubmission.score,
            passed,
            passingScore: assessment.passingScore, // Add passing score to help frontend
            startTime: userSubmission.startTime,
            endTime: userSubmission.endTime,
            totalTime: userSubmission.timeSpent,
            certificate: userSubmission.certificate
        };
        console.log("Assessment result:", {
            id: result._id,
            score: result.score,
            passed: result.passed,
            passingScore: result.passingScore,
            totalTime: result.totalTime
        });
        res.status(200).json({ result });
    }
    catch (error) {
        console.error(`Error fetching assessment result for ${id}:`, error);
        res.status(500).json({ message: "Error retrieving assessment result", error: error.message });
    }
}));
// get detailed results for an assessment submission
exports.getDetailedAssessmentResults = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
        const userSubmission = (_a = assessment.submissions) === null || _a === void 0 ? void 0 : _a.find((submission) => submission.user.toString() === req.userId);
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
        // Check if the user has a certificate for this assessment
        let certificate = null;
        if (isPassed) {
            certificate = yield certificate_model_1.default.findOne({
                userId: req.userId,
                assessmentId: assessment._id,
            }).lean();
        }
        // Prepare final response
        const results = {
            assessmentId: assessment._id,
            title: assessment.title,
            courseTitle: ((_b = assessment.course) === null || _b === void 0 ? void 0 : _b.title) || "No course",
            submittedAt: userSubmission.endTime,
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
            certificate: certificate
                ? {
                    id: certificate._id,
                    title: certificate.title,
                    credentialId: certificate.credentialId,
                    issueDate: certificate.issueDate,
                    grade: certificate.grade,
                }
                : null,
        };
        return res.status(200).json(results);
    }
    catch (error) {
        console.error("Error getting assessment results:", error);
        return res.status(500).json({ message: "Server error" });
    }
}));
// Get all assessments created by a tutor
exports.getTutorAssessments = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { tutorId } = req.params;
    console.log("Fetching assessments for tutor:", tutorId);
    if (!tutorId) {
        return res.status(400).json({ message: "Missing tutorId parameter" });
    }
    try {
        // Ensure tutorId is a valid MongoDB ObjectId if your database expects it
        const assessments = yield assessment_models_1.default.find({ createdBy: tutorId })
            .sort({ createdAt: -1 })
            .populate("course")
            .populate("questions");
        console.log(`Found ${assessments.length} assessments for tutor ${tutorId}`);
        return res.status(200).json({ assessments });
    }
    catch (error) {
        console.error("Error fetching tutor assessments:", error);
        return res.status(500).json({ message: "Failed to fetch assessments", error: error.message });
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
