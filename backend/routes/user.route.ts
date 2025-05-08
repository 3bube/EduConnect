import express from "express";
import { updateProfile, updatePassword } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Update user profile
router.put("/profile", authMiddleware, updateProfile);

// Update password
router.put("/password", authMiddleware, updatePassword);

export default router; 