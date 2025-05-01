"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const live_class_controller_1 = require("../controllers/live-class.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Apply authentication middleware to all routes
router.use(auth_middleware_1.authMiddleware);
// Create a new live class (tutors only)
router.post("/", live_class_controller_1.createLiveClass);
// Start a live class (tutors only) - support both PATCH and PUT methods
router.patch("/:liveClassId/start", live_class_controller_1.startLiveClass);
router.put("/:liveClassId/start", live_class_controller_1.startLiveClass);
// End a live class (tutors only) - support both PATCH and PUT methods
router.patch("/:liveClassId/end", live_class_controller_1.endLiveClass);
router.put("/:liveClassId/end", live_class_controller_1.endLiveClass);
// Get all live classes (with filtering options)
router.get("/", live_class_controller_1.getLiveClasses);
// Get a specific live class by ID
router.get("/:liveClassId", live_class_controller_1.getLiveClassById);
// Join a live class - support both POST and PUT methods
router.post("/:liveClassId/join", live_class_controller_1.joinLiveClass);
router.put("/:liveClassId/join", live_class_controller_1.joinLiveClass);
// Leave a live class
router.post("/:liveClassId/leave", live_class_controller_1.leaveLiveClass);
// Get live classes created by the authenticated instructor
router.get("/instructor/my-classes", live_class_controller_1.getMyLiveClasses);
exports.default = router;
