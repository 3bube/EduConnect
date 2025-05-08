import { Router } from "express";
import { register, signIn, getCurrentUser, updateCurrentUser } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/signin", signIn);

router.get(
  "/me",
  authMiddleware,
  getCurrentUser
);

// Update current user profile
router.put(
  "/me",
  authMiddleware,
  updateCurrentUser
);

export default router;
