import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import * as adminController from "../controllers/admin.controller";

const router = express.Router();


// Utility to wrap async handlers and ensure they return void
function handleAsync(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// User management
router.get("/users", authMiddleware, handleAsync(adminController.getAllUsers));
router.post("/users", authMiddleware, handleAsync(adminController.createUser));
router.delete("/users/:userId", authMiddleware, handleAsync(adminController.deleteUser));

// Course management
router.delete("/courses/:courseId", authMiddleware, handleAsync(adminController.deleteCourse));
router.patch("/courses/:courseId", authMiddleware, handleAsync(adminController.updateCourse));

// Lesson management
router.get("/lessons", authMiddleware, handleAsync(adminController.getAllLessons));

export default router;
