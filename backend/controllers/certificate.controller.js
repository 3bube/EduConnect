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
exports.generateCertificateFromAssessment = exports.verifyCertificate = exports.getCertificateById = exports.getUserCertificates = exports.generateCertificate = void 0;
const certificate_model_1 = __importDefault(require("../models/certificate.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const assessment_models_1 = __importDefault(require("../models/assessment.models"));
const handler_1 = require("../utils/handler");
const course_model_1 = __importDefault(require("../models/course.model"));
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
        const userSubmission = (_a = assessment.submissions) === null || _a === void 0 ? void 0 : _a.find((submission) => submission.user.toString() === req.userId);
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
            skills: assessment.course
                ? assessment.course.skills || []
                : [],
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
// Get all certificates for the logged in user
exports.getUserCertificates = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const certificates = yield certificate_model_1.default.find({ userId: req.userId })
            .populate("courseId", "title image")
            .populate("assessmentId", "title type")
            .sort({ issueDate: -1 }) // Most recent first
            .lean();
        return res.status(200).json({ certificates });
    }
    catch (error) {
        console.error("Error fetching certificates:", error);
        return res.status(500).json({
            message: "Failed to fetch certificates",
            error: error.message,
        });
    }
}));
// Get certificate by ID
exports.getCertificateById = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.params;
    try {
        console.log(`Looking up certificate with id/credentialId: ${id}`);
        // Check if the id is a valid MongoDB ObjectId
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        let certificate;
        if (isValidObjectId) {
            console.log('Looking up certificate by _id');
            certificate = yield certificate_model_1.default.findById(id)
                .populate("courseId", "title description image level")
                .populate("assessmentId", "title type")
                .populate("userId", "name email")
                .lean();
        }
        else {
            console.log('Looking up certificate by credentialId');
            certificate = yield certificate_model_1.default.findOne({ credentialId: id })
                .populate("courseId", "title description image level")
                .populate("assessmentId", "title type")
                .populate("userId", "name email")
                .lean();
        }
        if (!certificate) {
            return res.status(404).json({ message: "Certificate not found" });
        }
        // get user role from the user model
        const user = yield user_model_1.default.findById(req.userId).select("role").lean();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if the certificate belongs to the user or if user is an admin/tutor
        if (certificate.userId._id.toString() !== req.userId && user.role !== "admin") {
            console.log(`Access denied: Certificate userId ${certificate.userId._id} does not match request userId ${req.userId}`);
            return res
                .status(403)
                .json({ message: "Not authorized to view this certificate" });
        }
        console.log(`Certificate found and authorized for user ${req.userId}`);
        return res.status(200).json({ certificate });
    }
    catch (error) {
        console.error("Error fetching certificate:", error);
        return res.status(500).json({
            message: "Failed to fetch certificate",
            error: error.message,
        });
    }
}));
// Verify certificate validity
exports.verifyCertificate = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { credentialId } = req.params;
    try {
        // Add proper type casting for the populated fields
        const certificate = yield certificate_model_1.default.findOne({ credentialId })
            .populate("courseId", "title")
            .populate("userId", "name")
            .lean();
        if (!certificate) {
            return res.status(404).json({
                valid: false,
                message: "Certificate not found",
            });
        }
        const isExpired = certificate.expiryDate && new Date() > new Date(certificate.expiryDate);
        const isRevoked = certificate.status === "revoked";
        return res.status(200).json({
            valid: !isExpired && !isRevoked,
            certificate: {
                credentialId: certificate.credentialId,
                title: certificate.title,
                issueDate: certificate.issueDate,
                expiryDate: certificate.expiryDate,
                courseName: certificate.courseId.title,
                userName: certificate.userId.name,
                status: certificate.status,
                grade: certificate.grade,
            },
            message: isExpired
                ? "Certificate has expired"
                : isRevoked
                    ? "Certificate has been revoked"
                    : "Certificate is valid",
        });
    }
    catch (error) {
        console.error("Error verifying certificate:", error);
        return res.status(500).json({
            valid: false,
            message: "Failed to verify certificate",
            error: error.message,
        });
    }
}));
// Generate a certificate for a specific assessment
exports.generateCertificateFromAssessment = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { assessmentId } = req.params;
    console.log(`Manual certificate generation requested for assessment ${assessmentId} by user ${req.userId}`);
    try {
        // 1. Find the assessment
        const assessment = yield assessment_models_1.default.findById(assessmentId)
            .populate("course")
            .lean();
        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }
        console.log("assessment", assessment);
        // 2. Find the user's submission for this assessment
        const userSubmission = (_a = assessment.submissions) === null || _a === void 0 ? void 0 : _a.find(sub => { var _a; return ((_a = sub.userId) === null || _a === void 0 ? void 0 : _a.toString()) === req.userId; });
        if (!userSubmission) {
            return res.status(404).json({
                message: "No submission found for this assessment",
                assessmentId
            });
        }
        console.log("userSubmission", userSubmission);
        // 3. Check if the user has passed the assessment
        const passed = userSubmission.score >= assessment.passingScore;
        if (!passed) {
            return res.status(400).json({
                message: "Cannot generate certificate - assessment not passed",
                score: userSubmission.score,
                requiredScore: assessment.passingScore,
                passed
            });
        }
        console.log("checking for exisiting certificate");
        // 4. Check if a certificate already exists
        const existingCertificate = yield certificate_model_1.default.findOne({
            userId: req.userId,
            assessmentId: assessment._id
        });
        if (existingCertificate) {
            return res.status(200).json({
                message: "Certificate already exists",
                certificate: existingCertificate
            });
        }
        console.log("existingCertificate", existingCertificate);
        // 5. Extract course ID
        let courseId;
        if (typeof assessment.course === 'object' && assessment.course) {
            courseId = assessment.course;
        }
        else if (assessment.course) {
            courseId = assessment.course;
        }
        else if (assessment.course) {
            courseId = assessment.course;
        }
        else {
            return res.status(400).json({
                message: "No course found for this assessment"
            });
        }
        // 6. Get the course details
        const course = yield course_model_1.default.findById(courseId).lean();
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
                courseId
            });
        }
        console.log("course", course);
        // 7. Create the certificate
        // Determine grade based on score
        let grade = "C";
        if (userSubmission.score >= 90)
            grade = "A";
        else if (userSubmission.score >= 80)
            grade = "B";
        else if (userSubmission.score >= 70)
            grade = "C";
        else if (userSubmission.score >= 60)
            grade = "D";
        else
            grade = "F";
        // Get skills from course tags or default to empty array
        const skills = course.tags || [];
        // Create new certificate
        const certificate = new certificate_model_1.default({
            userId: req.userId,
            courseId: course._id,
            assessmentId: assessment._id,
            title: `${course.title} Certificate`,
            issueDate: new Date(),
            // Set expiry to 3 years from now
            expiryDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000),
            grade,
            score: userSubmission.score,
            skills,
            issuer: "EduConnect",
            status: "issued",
            credentialId: `CERT-${course.title.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
        });
        yield certificate.save();
        // 8. Update user's certificates array
        yield user_model_1.default.findByIdAndUpdate(req.userId, {
            $addToSet: { certificates: certificate._id },
        });
        console.log(`Certificate generated successfully: ${certificate._id}`);
        // 9. Return the certificate
        return res.status(201).json({
            message: "Certificate generated successfully",
            certificate
        });
    }
    catch (error) {
        console.error("Error generating certificate:", error);
        return res.status(500).json({
            message: "Failed to generate certificate",
            error: error.message
        });
    }
}));
