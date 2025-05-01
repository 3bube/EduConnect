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
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const student_controller_1 = require("../controllers/student.controller");
const handler_1 = require("../utils/handler");
const course_model_1 = __importDefault(require("../models/course.model"));
const progress_utils_1 = require("../utils/progress.utils");
const router = express_1.default.Router();
// Apply auth middleware to all routes
router.use(auth_middleware_1.authMiddleware);
// Student dashboard routes
router.get("/dashboard", student_controller_1.getStudentDashboard);
router.get("/courses/enrolled", student_controller_1.getEnrolledCoursesProgress);
router.get("/assessments/upcoming", student_controller_1.getUpcomingAssignmentsController);
router.get("/courses/recommended", student_controller_1.getRecommendedCoursesController);
router.get("/classes/upcoming", student_controller_1.getUpcomingClassesController);
router.get("/stats", student_controller_1.getLearningStatsController);
router.post("/demo-progress", student_controller_1.createDemoCourseProgress);
router.post("/courses/:courseId/lessons/:lessonId/progress", student_controller_1.updateLessonProgress);
router.post("/courses/:courseId/assignments/:assignmentId/progress", student_controller_1.updateAssignmentProgress);
router.post("/courses/:courseId/time-spent", student_controller_1.updateTimeSpent);
// Create a controller function to handle course progress retrieval
const getCourseProgress = (0, handler_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { courseId } = req.params;
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        // Get the user's progress for this course
        const progress = yield (0, progress_utils_1.getUserCourseProgress)(userId, courseId);
        // Get the course to determine total lessons
        const course = yield course_model_1.default.findById(courseId);
        const totalLessons = ((_a = course === null || course === void 0 ? void 0 : course.lessons) === null || _a === void 0 ? void 0 : _a.length) || 0;
        if (!progress) {
            return res.status(200).json({
                progress: {
                    courseId,
                    completedLessonsCount: 0,
                    totalLessons,
                    progressPercentage: 0,
                    timeSpent: 0,
                    completedLessons: [],
                },
            });
        }
        res.status(200).json({
            progress: {
                courseId: progress.courseId,
                completedLessonsCount: progress.completedLessons.length,
                totalLessons,
                progressPercentage: progress.progress,
                timeSpent: progress.timeSpent,
                completedLessons: progress.completedLessons,
                lastAccessed: progress.lastAccessed,
            },
        });
    }
    catch (error) {
        console.error("Error retrieving course progress:", error);
        res.status(500).json({
            message: "Failed to retrieve course progress",
            error: error.message,
        });
    }
}));
// Add the new route
router.get("/courses/:courseId/progress", getCourseProgress);
router.get("/courses/:courseId/lessons/:lessonId/progress", (req, res) => {
    // Placeholder for lesson progress retrieval
    res.status(200).json({ message: "Lesson progress retrieved successfully" });
});
router.get("/courses/:courseId/assignments/:assignmentId/progress", (req, res) => {
    // Placeholder for assignment progress retrieval
    res
        .status(200)
        .json({ message: "Assignment progress retrieved successfully" });
});
router.get("/courses/:courseId/time-spent", (req, res) => {
    // Placeholder for time spent retrieval
    res.status(200).json({ message: "Time spent retrieved successfully" });
});
exports.default = router;
