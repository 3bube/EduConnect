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
exports.getMyLiveClasses = exports.leaveLiveClass = exports.joinLiveClass = exports.getLiveClassById = exports.getLiveClasses = exports.endLiveClass = exports.startLiveClass = exports.createLiveClass = void 0;
const live_class_model_1 = __importDefault(require("../models/live-class.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const handler_1 = require("../utils/handler");
const mongoose_1 = __importDefault(require("mongoose"));
// Create a new live class
exports.createLiveClass = (0, handler_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, subject, startTime, courseId, meetingUrl, meetingId, maxParticipants, } = req.body;
    // Get instructor details from authenticated user
    const userId = req.userId;
    if (!userId) {
        return res
            .status(401)
            .json({ message: "Unauthorized. User not authenticated." });
    }
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }
    if (user.role !== "tutor" && user.role !== "both") {
        return res
            .status(403)
            .json({ message: "Only tutors can create live classes." });
    }
    // Create the live class
    const liveClass = new live_class_model_1.default({
        title,
        description,
        subject,
        startTime: new Date(startTime),
        isLive: false, // Initially not live
        instructor: {
            id: user.id,
            name: user.name,
            // avatar: user.avatar || "", // Use default avatar if not available
        },
        participants: [],
        courseId: courseId || null,
        meetingUrl,
        meetingId,
        maxParticipants: maxParticipants || 100,
    });
    yield liveClass.save();
    return res.status(201).json({
        success: true,
        message: "Live class created successfully",
        data: liveClass,
    });
}));
// Start a live class
exports.startLiveClass = (0, handler_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { liveClassId } = req.params;
    // Validate ObjectId
    if (!mongoose_1.default.Types.ObjectId.isValid(liveClassId)) {
        return res.status(400).json({ message: "Invalid live class ID." });
    }
    // Get instructor details from authenticated user
    const userId = req.userId;
    console.log("user id", userId);
    if (!userId) {
        return res
            .status(401)
            .json({ message: "Unauthorized. User not authenticated." });
    }
    const liveClass = yield live_class_model_1.default.findById(liveClassId);
    if (!liveClass) {
        return res.status(404).json({ message: "Live class not found." });
    }
    console.log("live class", liveClass.instructor);
    // Check if the user is the instructor of this class
    if (liveClass.instructor.id !== userId) {
        return res
            .status(403)
            .json({ message: "Only the instructor can start this live class." });
    }
    // Update the live class status
    liveClass.isLive = true;
    liveClass.startTime = new Date(); // Update start time to now
    // Ensure we have a valid meeting URL
    if (!liveClass.meetingUrl || liveClass.meetingUrl.includes("placeholder")) {
        // Generate a real meeting URL based on the live class ID
        liveClass.meetingUrl = `http://localhost:3000/live-classes/${liveClassId}`;
    }
    yield liveClass.save();
    return res.status(200).json({
        success: true,
        message: "Live class started successfully",
        meetingUrl: liveClass.meetingUrl,
        meetingId: liveClass.meetingId,
        liveClass: liveClass,
    });
}));
// End a live class
exports.endLiveClass = (0, handler_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { liveClassId } = req.params;
    // Validate ObjectId
    if (!mongoose_1.default.Types.ObjectId.isValid(liveClassId)) {
        return res.status(400).json({ message: "Invalid live class ID." });
    }
    // Get instructor details from authenticated user
    const userId = req.userId;
    if (!userId) {
        return res
            .status(401)
            .json({ message: "Unauthorized. User not authenticated." });
    }
    const liveClass = yield live_class_model_1.default.findById(liveClassId);
    if (!liveClass) {
        return res.status(404).json({ message: "Live class not found." });
    }
    // Check if the user is the instructor of this class
    if (liveClass.instructor.id !== userId) {
        return res
            .status(403)
            .json({ message: "Only the instructor can end this live class." });
    }
    // Update the live class status
    liveClass.isLive = false;
    liveClass.endTime = new Date(); // Set end time to now
    yield liveClass.save();
    return res.status(200).json({
        success: true,
        message: "Live class ended successfully",
        data: liveClass,
    });
}));
// Get all live classes (with filtering options)
exports.getLiveClasses = (0, handler_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isLive, subject, instructorId } = req.query;
    // Build filter object based on query parameters
    const filter = {};
    if (isLive !== undefined) {
        filter.isLive = isLive === "true";
    }
    if (subject) {
        filter.subject = subject;
    }
    if (instructorId) {
        filter["instructor.id"] = instructorId;
    }
    // Find live classes based on filters
    const liveClasses = yield live_class_model_1.default.find(filter)
        .sort({ startTime: -1 }) // Sort by start time, newest first
        .limit(50); // Limit to 50 results
    return res.status(200).json({
        success: true,
        count: liveClasses.length,
        data: liveClasses,
    });
}));
// Get a specific live class by ID
exports.getLiveClassById = (0, handler_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { liveClassId } = req.params;
    let liveClass;
    try {
        // Try to find by ObjectId first (for existing MongoDB IDs)
        if (mongoose_1.default.Types.ObjectId.isValid(liveClassId)) {
            liveClass = yield live_class_model_1.default.findById(liveClassId);
        }
        // If not found or not a valid ObjectId, try to find by meetingId
        if (!liveClass) {
            liveClass = yield live_class_model_1.default.findOne({ meetingId: liveClassId });
        }
        // If still not found, try to find by custom ID field if it exists
        if (!liveClass) {
            liveClass = yield live_class_model_1.default.findOne({
                meetingUrl: { $regex: liveClassId, $options: "i" },
            });
        }
        if (!liveClass) {
            return res.status(404).json({ message: "Live class not found." });
        }
        // Convert Mongoose document to a plain JavaScript object
        const liveClassObj = liveClass.toObject();
        // Ensure the instructor ID is properly formatted
        if (liveClassObj.instructor && !liveClassObj.instructor.id) {
            liveClassObj.instructor.id = liveClassObj.instructor.id;
        }
        return res.status(200).json({
            success: true,
            data: liveClassObj,
        });
    }
    catch (error) {
        console.error("Error fetching live class:", error);
        return res
            .status(500)
            .json({ message: "Server error while fetching live class." });
    }
}));
// Join a live class
exports.joinLiveClass = (0, handler_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { liveClassId } = req.params;
    // Validate ObjectId
    if (!mongoose_1.default.Types.ObjectId.isValid(liveClassId)) {
        return res.status(400).json({ message: "Invalid live class ID." });
    }
    // Get user details from authenticated user
    const userId = req.userId;
    if (!userId) {
        return res
            .status(401)
            .json({ message: "Unauthorized. User not authenticated." });
    }
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }
    const liveClass = yield live_class_model_1.default.findById(liveClassId);
    if (!liveClass) {
        return res.status(404).json({ message: "Live class not found." });
    }
    // Check if the class is live
    if (!liveClass.isLive) {
        return res
            .status(400)
            .json({ message: "This class is not currently live." });
    }
    // Check if user is already a participant
    const isParticipant = liveClass.participants.some((p) => p.id === userId);
    if (!isParticipant) {
        // Check if class has reached max participants
        if (liveClass.maxParticipants &&
            liveClass.participants.length >= liveClass.maxParticipants) {
            return res
                .status(400)
                .json({ message: "This class has reached maximum capacity." });
        }
        // Add user to participants
        liveClass.participants.push({
            id: user.id,
            name: user.name,
            joinedAt: new Date(),
        });
        yield liveClass.save();
    }
    // Determine if the user is the instructor of this class
    const isInstructor = liveClass.instructor.id === userId;
    return res.status(200).json({
        success: true,
        message: "Joined live class successfully",
        data: {
            meetingUrl: liveClass.meetingUrl,
            meetingId: liveClass.meetingId,
            liveClass,
            isInstructor, // Add this flag to indicate if the user is the instructor
            role: isInstructor ? "instructor" : "student", // Explicitly state the user's role
        },
    });
}));
// Leave a live class
exports.leaveLiveClass = (0, handler_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { liveClassId } = req.params;
    // Validate ObjectId
    if (!mongoose_1.default.Types.ObjectId.isValid(liveClassId)) {
        return res.status(400).json({ message: "Invalid live class ID." });
    }
    // Get user details from authenticated user
    const userId = req.userId;
    if (!userId) {
        return res
            .status(401)
            .json({ message: "Unauthorized. User not authenticated." });
    }
    const liveClass = yield live_class_model_1.default.findById(liveClassId);
    if (!liveClass) {
        return res.status(404).json({ message: "Live class not found." });
    }
    // Remove user from participants
    liveClass.participants = liveClass.participants.filter((p) => p.id !== userId);
    yield liveClass.save();
    return res.status(200).json({
        success: true,
        message: "Left live class successfully",
    });
}));
// Get live classes created by the authenticated instructor
exports.getMyLiveClasses = (0, handler_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get user ID from authenticated user
    const userId = req.userId;
    if (!userId) {
        return res
            .status(401)
            .json({ message: "Unauthorized. User not authenticated." });
    }
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }
    // Check if user is a tutor
    if (user.role !== "tutor" && user.role !== "both") {
        return res
            .status(403)
            .json({ message: "Only tutors can access their live classes." });
    }
    // Find live classes where the user is the instructor
    const liveClasses = yield live_class_model_1.default.find({ "instructor.id": userId }).sort({
        startTime: -1,
    }); // Sort by start time, newest first
    return res.status(200).json({
        success: true,
        count: liveClasses.length,
        data: liveClasses,
    });
}));
