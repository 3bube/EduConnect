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
exports.getCertificateById = exports.getUserCertificates = exports.generateCertificate = void 0;
const certificate_model_1 = __importDefault(require("../models/certificate.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const assessment_models_1 = __importDefault(require("../models/assessment.models"));
const handler_1 = require("../utils/handler");
// Generate a certificate upon successful assessment completion
exports.generateCertificate = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        const existingCertificate = yield certificate_model_1.default.findOne({
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
        const assessment = yield assessment_models_1.default.findById(assessmentId)
            .populate("questions")
            .populate("course", "title skills")
            .lean();
        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }
        // Find the user's submission
        const userSubmission = (_a = assessment.submissions) === null || _a === void 0 ? void 0 : _a.find((submission) => submission.userId.toString() === req.userId);
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
        if (percentage >= 90)
            grade = "A";
        else if (percentage >= 80)
            grade = "B";
        else if (percentage >= 70)
            grade = "C";
        else if (percentage >= 60)
            grade = "D";
        // Calculate expiry date (3 years from now)
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 3);
        // Create the certificate
        const certificate = new certificate_model_1.default({
            title: assessment.title,
            issueDate: new Date(),
            expiryDate: expiryDate,
            userId: req.userId,
            courseId: courseId,
            assessmentId: assessmentId,
            issuer: "EduConnect",
            grade: grade,
            skills: assessment.course ? assessment.course.skills || [] : [],
        });
        yield certificate.save();
        // Add certificate to user's certificates array
        yield user_model_1.default.findByIdAndUpdate(req.userId, {
            $push: { certificates: certificate._id },
        });
        res.status(201).json({
            message: "Certificate generated successfully",
            certificate,
        });
    }
    catch (error) {
        console.error("Error generating certificate:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
// Get all certificates for the logged-in user
exports.getUserCertificates = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const certificates = yield certificate_model_1.default.find({ userId: req.userId })
            .populate("courseId", "title")
            .populate("assessmentId", "title")
            .sort({ issueDate: -1 });
        res.status(200).json({ certificates });
    }
    catch (error) {
        console.error("Error fetching certificates:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
// Get a specific certificate by ID
exports.getCertificateById = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    try {
        const certificate = yield certificate_model_1.default.findById(id)
            .populate("courseId", "title")
            .populate("assessmentId", "title")
            .populate("userId", "name email");
        if (!certificate) {
            return res.status(404).json({ message: "Certificate not found" });
        }
        // Check if certificate belongs to the user or user is admin
        if (certificate.userId.toString() !== req.userId
        // Only allow the user who owns the certificate to access it
        // Admin check removed as userRole is not in ExtendedRequest
        ) {
            return res.status(403).json({ message: "Unauthorized access" });
        }
        res.status(200).json({ certificate });
    }
    catch (error) {
        console.error("Error fetching certificate:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
