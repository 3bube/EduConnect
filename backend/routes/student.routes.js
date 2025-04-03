"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const student_controller_1 = require("../controllers/student.controller");
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
exports.default = router;
