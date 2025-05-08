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
exports.getAllUsers = getAllUsers;
exports.createUser = createUser;
exports.deleteUser = deleteUser;
exports.deleteCourse = deleteCourse;
exports.updateCourse = updateCourse;
exports.getAllLessons = getAllLessons;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
// Fetch all users
function getAllUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield user_model_1.default.find({});
            res.json(users);
        }
        catch (error) {
            next(error);
        }
    });
}
// Create a user
function createUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password, role } = req.body;
            if (!name || !email || !password || !role) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const existingUser = yield user_model_1.default.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User with this email already exists" });
            }
            const newUser = new user_model_1.default({
                name,
                email,
                password, // Should hash in production
                role,
                createdAt: new Date(),
            });
            yield newUser.save();
            res.status(201).json(newUser);
        }
        catch (error) {
            next(error);
        }
    });
}
// Delete a user
function deleteUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const result = yield user_model_1.default.deleteOne({ _id: new mongoose_1.default.Types.ObjectId(userId) });
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json({ message: "User deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    });
}
// Delete a course
function deleteCourse(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { courseId } = req.params;
            const result = yield course_model_1.default.deleteOne({ _id: new mongoose_1.default.Types.ObjectId(courseId) });
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Course not found" });
            }
            res.json({ message: "Course deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    });
}
// Update course (e.g., featured)
function updateCourse(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { courseId } = req.params;
            const { featured } = req.body;
            const result = yield course_model_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(courseId) }, { $set: { featured } });
            if (result.matchedCount === 0) {
                return res.status(404).json({ message: "Course not found" });
            }
            const updatedCourse = yield course_model_1.default.findById(courseId);
            res.json(updatedCourse);
        }
        catch (error) {
            next(error);
        }
    });
}
// Get all lessons
function getAllLessons(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lessons = yield req.app.locals.db.collection("lessons").find({}).toArray();
            res.json(lessons);
        }
        catch (error) {
            next(error);
        }
    });
}
