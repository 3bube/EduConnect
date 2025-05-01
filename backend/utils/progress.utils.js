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
exports.getUserCourseProgress = exports.updateUserCourseProgress = exports.calculateCourseProgress = void 0;
const course_model_1 = __importDefault(require("../models/course.model"));
const courseProgress_model_1 = __importDefault(require("../models/courseProgress.model"));
/**
 * Calculates the progress percentage for a course based on completed lessons
 * @param courseId - The ID of the course
 * @param completedLessonIds - Array of completed lesson IDs
 * @returns Progress percentage (0-100)
 */
const calculateCourseProgress = (courseId, completedLessonIds) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get the course to count total lessons
        const course = yield course_model_1.default.findById(courseId);
        if (!course) {
            throw new Error(`Course with ID ${courseId} not found`);
        }
        // Count total lessons in the course
        const totalLessons = ((_a = course.lessons) === null || _a === void 0 ? void 0 : _a.length) || 0;
        if (totalLessons === 0) {
            return 0; // No lessons in the course
        }
        // Calculate progress percentage
        const completedCount = completedLessonIds.length;
        const progressPercentage = Math.round((completedCount / totalLessons) * 100);
        // Ensure progress is between 0 and 100
        return Math.min(Math.max(progressPercentage, 0), 100);
    }
    catch (error) {
        console.error("Error calculating course progress:", error);
        return 0; // Default to 0% on error
    }
});
exports.calculateCourseProgress = calculateCourseProgress;
/**
 * Updates or creates a course progress record for a user
 * @param userId - The user ID
 * @param courseId - The course ID
 * @param lessonId - The lesson ID that was completed (optional)
 * @returns The updated course progress record
 */
const updateUserCourseProgress = (userId, courseId, lessonId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find existing progress record or create a new one
        let progress = yield courseProgress_model_1.default.findOne({
            userId,
            courseId,
        });
        if (!progress) {
            // Create new progress record if none exists
            progress = new courseProgress_model_1.default({
                userId,
                courseId,
                completedLessons: [],
                completedAssignments: [],
                progress: 0,
                timeSpent: 0,
                lastAccessed: new Date(),
                startDate: new Date(),
            });
        }
        // Update last accessed timestamp
        progress.lastAccessed = new Date();
        // If a lesson ID was provided, mark it as completed
        if (lessonId) {
            // Store the lesson ID as a string to avoid ObjectId conversion issues
            const lessonIdString = lessonId.toString();
            // Check if lesson is already marked as completed
            const lessonAlreadyCompleted = progress.completedLessons.some((id) => id.toString() === lessonIdString);
            // Add lesson to completed lessons if not already completed
            if (!lessonAlreadyCompleted) {
                progress.completedLessons.push(lessonIdString);
            }
        }
        // Calculate and update progress percentage
        progress.progress = yield (0, exports.calculateCourseProgress)(courseId, progress.completedLessons);
        // Save the updated progress
        yield progress.save();
        return progress;
    }
    catch (error) {
        console.error("Error updating user course progress:", error);
        throw error;
    }
});
exports.updateUserCourseProgress = updateUserCourseProgress;
/**
 * Gets the course progress for a specific user and course
 * @param userId - The user ID
 * @param courseId - The course ID
 * @returns The course progress record or null if not found
 */
const getUserCourseProgress = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield courseProgress_model_1.default.findOne({
            userId,
            courseId,
        });
    }
    catch (error) {
        console.error("Error getting user course progress:", error);
        return null;
    }
});
exports.getUserCourseProgress = getUserCourseProgress;
