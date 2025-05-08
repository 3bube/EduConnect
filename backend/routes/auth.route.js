"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.register);
router.post("/signin", auth_controller_1.signIn);
router.get("/me", auth_middleware_1.authMiddleware, auth_controller_1.getCurrentUser);
// Update current user profile
router.put("/me", auth_middleware_1.authMiddleware, auth_controller_1.updateCurrentUser);
exports.default = router;
