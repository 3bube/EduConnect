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
exports.markLessonComplete = exports.getLessonContent = exports.enrollCourse = exports.getCourseById = exports.getInstructorCourses = exports.getAllCourses = exports.createCourse = void 0;
const course_model_1 = __importDefault(require("../models/course.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
// Create a course
const createCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        // Get the complete user data from database
        const userId = req.userId;
        const instructor = yield user_model_1.default.findById(userId);
        if (!instructor) {
            res.status(404).json({ message: "Instructor not found" });
            return;
        }
        const { title, description, longDescription, category, level, lessons, duration, price, image, tags, requirements, objectives, modules, resources, } = req.body;
        if (!title ||
            !description ||
            !category ||
            !level ||
            !duration ||
            !price ||
            !modules) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const newCourse = yield course_model_1.default.create({
            title,
            description,
            longDescription,
            category,
            level,
            duration,
            price,
            image: image || "/placeholder.svg?height=400&width=800", // Default image if not provided
            tags: tags || [],
            requirements: requirements || [],
            objectives: objectives || [],
            modules: modules || [],
            resources: resources || [],
            instructor: {
                id: instructor._id,
                name: instructor.name,
                avatar: "/placeholder.svg?height=100&width=100", // Default avatar
            },
            rating: 0,
            reviews: 0,
            students: 0,
            featured: false,
            progress: 0,
            completedLessons: [],
            nextLesson: lessons && lessons.length > 0
                ? { id: lessons[0].id, title: lessons[0].title }
                : { id: "", title: "" },
            lessons: lessons || [],
            enrolled: false,
        });
        console.log("Course created:", newCourse);
        res.status(201).json({ message: "Course Created", course: newCourse });
    }
    catch (error) {
        console.error("Error creating course:", error);
        res
            .status(500)
            .json({ message: error.message || "Failed to create course" });
    }
});
exports.createCourse = createCourse;
// Get all courses
const getAllCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield course_model_1.default.find({});
        res.status(200).json({ courses });
    }
    catch (error) {
        console.error("Error fetching courses:", error);
        res
            .status(500)
            .json({ message: error.message || "Failed to fetch courses" });
    }
});
exports.getAllCourses = getAllCourses;
// Get course for instructor
const getInstructorCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const courses = yield course_model_1.default.find({ "instructor.id": id });
        res.status(200).json({ courses });
    }
    catch (error) {
        console.error("Error fetching courses:", error);
        res
            .status(500)
            .json({ message: error.message || "Failed to fetch courses" });
    }
});
exports.getInstructorCourses = getInstructorCourses;
// Get course by ID
const getCourseById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(courseId)) {
            res.status(400).json({ message: "Invalid course ID" });
            return;
        }
        const course = yield course_model_1.default.findById(courseId);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        res.status(200).json({ course });
    }
    catch (error) {
        console.error("Error fetching course:", error);
        res
            .status(500)
            .json({ message: error.message || "Failed to fetch course" });
    }
});
exports.getCourseById = getCourseById;
// Enroll in a course
const enrollCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { courseId } = req.params;
        const userId = req.userId;
        // Check if course exists
        const course = yield course_model_1.default.findById(courseId);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        // Find user and update enrolled courses
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Check if already enrolled
        const courseObjectId = new mongoose_1.default.Types.ObjectId(courseId);
        const enrolledCourses = user.enrolledCourses;
        if (enrolledCourses.some((id) => id.equals(courseObjectId))) {
            res.status(400).json({ message: "Already enrolled in this course" });
            return;
        }
        // Update user's enrolled courses
        enrolledCourses.push(courseObjectId);
        yield user.save();
        // Update course's student count
        course.students += 1;
        course.enrolled = true;
        yield course.save();
        console.log("Enrolled in course:", course);
        res.status(200).json({ message: "Successfully enrolled in course" });
    }
    catch (error) {
        console.error("Error enrolling in course:", error);
        res
            .status(500)
            .json({ message: error.message || "Failed to enroll in course" });
    }
});
exports.enrollCourse = enrollCourse;
// Get lesson content
const getLessonContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { courseId, lessonId } = req.params;
        const userId = req.userId;
        // Check if course exists
        const course = yield course_model_1.default.findById(courseId);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        // Find user
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Check if user is enrolled in the course
        const courseObjectId = new mongoose_1.default.Types.ObjectId(courseId);
        const enrolledCourses = user.enrolledCourses;
        if (!enrolledCourses.some((id) => id.equals(courseObjectId))) {
            res.status(403).json({ message: "Not enrolled in this course" });
            return;
        }
        // Find the lesson
        const lesson = course.lessons.find((l) => l.id === lessonId);
        if (!lesson) {
            res.status(404).json({ message: "Lesson not found" });
            return;
        }
        res.status(200).json({ lesson });
    }
    catch (error) {
        console.error("Error fetching lesson:", error);
        res
            .status(500)
            .json({ message: error.message || "Failed to fetch lesson" });
    }
});
exports.getLessonContent = getLessonContent;
// Mark lesson as completed
const markLessonComplete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { courseId, lessonId } = req.params;
        const userId = req.userId;
        // Check if course exists
        const course = yield course_model_1.default.findById(courseId);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        // Find user
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Check if user is enrolled in the course
        const courseObjectId = new mongoose_1.default.Types.ObjectId(courseId);
        const enrolledCourses = user.enrolledCourses;
        if (!enrolledCourses.some((id) => id.equals(courseObjectId))) {
            res.status(403).json({ message: "Not enrolled in this course" });
            return;
        }
        // Find the lesson
        const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
        if (lessonIndex === -1) {
            res.status(404).json({ message: "Lesson not found" });
            return;
        }
        // Mark lesson as completed
        course.lessons[lessonIndex].completed = true;
        // Add to completed lessons if not already there
        if (!course.completedLessons.includes(lessonId)) {
            course.completedLessons.push(lessonId);
        }
        // Calculate progress
        const totalLessons = course.lessons.length;
        const completedCount = course.completedLessons.length;
        course.progress = Math.round((completedCount / totalLessons) * 100);
        // Update next lesson if there's a next one
        if (lessonIndex < course.lessons.length - 1) {
            const nextLesson = course.lessons[lessonIndex + 1];
            course.nextLesson = {
                id: nextLesson.id,
                title: nextLesson.title,
            };
        }
        yield course.save();
        console.log("Marked lesson as complete");
        res.status(200).json({
            message: "Lesson marked as completed",
            progress: course.progress,
            nextLesson: course.nextLesson,
        });
    }
    catch (error) {
        console.error("Error marking lesson complete:", error);
        res
            .status(500)
            .json({ message: error.message || "Failed to mark lesson as complete" });
    }
});
exports.markLessonComplete = markLessonComplete;
