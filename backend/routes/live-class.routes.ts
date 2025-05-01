import express from "express";
import { 
  createLiveClass, 
  startLiveClass, 
  endLiveClass, 
  getLiveClasses, 
  getLiveClassById,
  joinLiveClass,
  leaveLiveClass,
  getMyLiveClasses
} from "../controllers/live-class.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create a new live class (tutors only)
router.post("/", createLiveClass);

// Start a live class (tutors only) - support both PATCH and PUT methods
router.patch("/:liveClassId/start", startLiveClass);
router.put("/:liveClassId/start", startLiveClass);

// End a live class (tutors only) - support both PATCH and PUT methods
router.patch("/:liveClassId/end", endLiveClass);
router.put("/:liveClassId/end", endLiveClass);

// Get all live classes (with filtering options)
router.get("/", getLiveClasses);

// Get a specific live class by ID
router.get("/:liveClassId", getLiveClassById);

// Join a live class - support both POST and PUT methods
router.post("/:liveClassId/join", joinLiveClass);
router.put("/:liveClassId/join", joinLiveClass);

// Leave a live class
router.post("/:liveClassId/leave", leaveLiveClass);

// Get live classes created by the authenticated instructor
router.get("/instructor/my-classes", getMyLiveClasses);

export default router;
