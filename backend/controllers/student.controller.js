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
exports.getLearningStatsController = exports.getUpcomingClassesController = exports.getRecommendedCoursesController = exports.getUpcomingAssignmentsController = exports.getEnrolledCoursesProgress = exports.getStudentDashboard = void 0;
const course_model_1 = __importDefault(require("../models/course.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const assessment_models_1 = __importDefault(require("../models/assessment.models"));
const handler_1 = require("../utils/handler");
// Get student dashboard data
exports.getStudentDashboard = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // Get user data
    const user = yield user_model_1.default.findById(req.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // Return the enrolled courses for user
    const enrolledCourses = yield user_model_1.default.findById(req.userId).populate({
        path: "enrolledCourses",
        model: course_model_1.default,
    });
    console.log(enrolledCourses);
    // Get upcoming assignments
    const upcomingAssignments = yield getUpcomingAssignments(req.userId);
    // Get upcoming classes (if applicable)
    const upcomingClasses = yield getUpcomingClasses(req.userId);
    // Get recommended courses
    const recommendedCourses = yield getRecommendedCourses(req.userId);
    // Get learning stats
    const stats = yield getLearningStats(req.userId);
    res.status(200).json({
        enrolledCourses: enrolledCourses === null || enrolledCourses === void 0 ? void 0 : enrolledCourses.enrolledCourses,
        upcomingAssignments,
        upcomingClasses,
        recommendedCourses,
        stats,
    });
}));
// Get enrolled courses with progress
exports.getEnrolledCoursesProgress = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.userId);
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const courses = yield getEnrolledCoursesWithProgress(req.userId);
    res.status(200).json({ courses });
}));
// Get upcoming assignments
exports.getUpcomingAssignmentsController = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const assignments = yield getUpcomingAssignments(req.userId);
    res.status(200).json({ assignments });
}));
// Get recommended courses
exports.getRecommendedCoursesController = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const courses = yield getRecommendedCourses(req.userId);
    res.status(200).json({ courses });
}));
// Get upcoming classes
exports.getUpcomingClassesController = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const classes = yield getUpcomingClasses(req.userId);
    res.status(200).json({ classes });
}));
// Get learning stats
exports.getLearningStatsController = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const stats = yield getLearningStats(req.userId);
    res.status(200).json({ stats });
}));
// Helper functions
function getEnrolledCoursesWithProgress(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Find user to get enrolled courses
        const user = yield user_model_1.default.findById(userId);
        if (!user || !user.enrolledCourses || user.enrolledCourses.length === 0) {
            return [];
        }
        // Get enrolled course IDs
        const enrolledCourseIds = user.enrolledCourses;
        console.log(enrolledCourseIds);
        // Find courses with those IDs
        const courses = yield course_model_1.default.find({
            _id: { $in: enrolledCourseIds },
        });
        // Calculate progress for each course
        return courses.map((course) => {
            var _a;
            // Find user progress for this course (could be stored in a separate collection)
            // For now, we'll generate mock progress data
            const totalLessons = ((_a = course.lessons) === null || _a === void 0 ? void 0 : _a.length) || 1;
            const completedLessons = Math.floor(Math.random() * totalLessons); // Mock data
            const progress = Math.round((completedLessons / totalLessons) * 100);
            // Find next lesson
            let nextLesson = null;
            if (course.lessons && course.lessons.length > completedLessons) {
                const nextLessonData = course.lessons[completedLessons];
                nextLesson = {
                    id: nextLessonData.id,
                    title: nextLessonData.title,
                };
            }
            return {
                _id: course._id,
                title: course.title,
                description: course.description,
                category: course.category,
                level: course.level,
                price: course.price,
                duration: course.duration,
                image: course.image,
                instructor: course.instructor,
                tags: course.tags,
                lessons: course.lessons,
                progress,
                completedLessons,
                nextLesson,
            };
        });
    });
}
function getUpcomingAssignments(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get user's enrolled courses
        const user = yield user_model_1.default.findById(userId);
        if (!user || !user.enrolledCourses || user.enrolledCourses.length === 0) {
            return [];
        }
        // Get enrolled course IDs
        const enrolledCourseIds = user.enrolledCourses;
        // Find assessments for those courses with due dates in the future
        const now = new Date();
        const assessments = yield assessment_models_1.default.find({
            courseId: { $in: enrolledCourseIds },
            dueDate: { $gt: now },
        })
            .sort({ dueDate: 1 })
            .limit(5);
        // Get course info for each assessment
        const assessmentData = [];
        for (const assessment of assessments) {
            const course = yield course_model_1.default.findById(assessment.course);
            assessmentData.push({
                id: assessment._id,
                title: assessment.title,
                courseId: assessment.course,
                courseName: course ? course.title : "Unknown Course",
                dueDate: assessment.dueDate,
                status: "pending", // Could be "completed" or "overdue" based on user's submission status
            });
        }
        return assessmentData;
    });
}
function getUpcomingClasses(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // This would connect to a live class scheduling system
        // For now, return mock data
        return [
            {
                id: "class-1",
                title: "Introduction to Algebra",
                courseId: "course-123",
                courseName: "Mathematics 101",
                startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                endTime: new Date(Date.now() + 86400000 + 5400000).toISOString(), // Tomorrow + 1.5 hours
                tutor: "Dr. Smith",
            },
            {
                id: "class-2",
                title: "Advanced Programming Concepts",
                courseId: "course-456",
                courseName: "Computer Science Fundamentals",
                startTime: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
                endTime: new Date(Date.now() + 172800000 + 5400000).toISOString(), // Day after tomorrow + 1.5 hours
                tutor: "Prof. Johnson",
            },
        ];
    });
}
function getRecommendedCourses(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get user's enrolled courses to exclude them
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return [];
        }
        // Get enrolled course IDs to exclude
        const enrolledCourseIds = (user.enrolledCourses ||
            []);
        // Find courses not enrolled in, possibly filtered by user's interests or popular courses
        const recommendedCourses = yield course_model_1.default.find({
            _id: { $nin: enrolledCourseIds },
        }).limit(3);
        return recommendedCourses;
    });
}
function getLearningStats(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get user's enrolled courses
        const user = yield user_model_1.default.findById(userId);
        if (!user || !user.enrolledCourses || user.enrolledCourses.length === 0) {
            return {
                overallCompletion: 0,
                coursesEnrolled: 0,
                hoursStudied: 0,
                assignmentsCompleted: 0,
                totalAssignments: 0,
            };
        }
        // Get enrolled course IDs
        const enrolledCourseIds = user.enrolledCourses;
        const coursesEnrolled = enrolledCourseIds.length;
        // Calculate overall completion (mock data for now)
        // In a real app, you would track user progress in each course
        const overallCompletion = Math.floor(Math.random() * 100);
        // Mock hours studied
        const hoursStudied = Math.floor(Math.random() * 50) + 10;
        // Mock assignments data
        const totalAssignments = Math.floor(Math.random() * 20) + 5;
        const assignmentsCompleted = Math.floor(Math.random() * totalAssignments);
        return {
            overallCompletion,
            coursesEnrolled,
            hoursStudied,
            assignmentsCompleted,
            totalAssignments,
        };
    });
}
