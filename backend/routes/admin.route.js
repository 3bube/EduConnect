"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courses_controller_1 = require("../controllers/courses.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();

// Admin middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'both')) {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

// Admin user management routes
router.get("/users", auth_middleware_1.authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        // Fetch all users from database
        const users = await req.app.locals.db.collection('users').find({}).toArray();
        res.json(users);
    } catch (error) {
        next(error);
    }
});

router.post("/users", auth_middleware_1.authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Basic validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Check if user already exists
        const existingUser = await req.app.locals.db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        
        // Create new user
        const newUser = {
            name,
            email,
            password, // Note: In a real implementation, you'd hash the password
            role,
            createdAt: new Date()
        };
        
        const result = await req.app.locals.db.collection('users').insertOne(newUser);
        res.status(201).json({ ...newUser, _id: result.insertedId });
    } catch (error) {
        next(error);
    }
});

router.delete("/users/:userId", auth_middleware_1.authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        // Delete user
        const result = await req.app.locals.db.collection('users').deleteOne({ _id: userId });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
});

// Admin course management routes
router.patch("/courses/:courseId", auth_middleware_1.authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const { featured } = req.body;
        
        // Update course
        const result = await req.app.locals.db.collection('courses').updateOne(
            { _id: courseId },
            { $set: { featured } }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Course not found" });
        }
        
        const updatedCourse = await req.app.locals.db.collection('courses').findOne({ _id: courseId });
        res.json(updatedCourse);
    } catch (error) {
        next(error);
    }
});

// Admin lesson management routes
router.get("/lessons", auth_middleware_1.authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        // Fetch all lessons from database
        const lessons = await req.app.locals.db.collection('lessons').find({}).toArray();
        res.json(lessons);
    } catch (error) {
        next(error);
    }
});

exports.default = router;
