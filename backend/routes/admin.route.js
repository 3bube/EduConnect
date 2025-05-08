"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const adminController = __importStar(require("../controllers/admin.controller"));
const router = express_1.default.Router();
// Utility to wrap async handlers and ensure they return void
function handleAsync(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
// User management
router.get("/users", auth_middleware_1.authMiddleware, handleAsync(adminController.getAllUsers));
router.post("/users", auth_middleware_1.authMiddleware, handleAsync(adminController.createUser));
router.delete("/users/:userId", auth_middleware_1.authMiddleware, handleAsync(adminController.deleteUser));
// Course management
router.delete("/courses/:courseId", auth_middleware_1.authMiddleware, handleAsync(adminController.deleteCourse));
router.patch("/courses/:courseId", auth_middleware_1.authMiddleware, handleAsync(adminController.updateCourse));
// Lesson management
router.get("/lessons", auth_middleware_1.authMiddleware, handleAsync(adminController.getAllLessons));
exports.default = router;
