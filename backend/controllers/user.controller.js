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
exports.updatePassword = exports.updateProfile = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const handler_1 = require("../utils/handler");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Update user profile
exports.updateProfile = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { firstName, lastName, email, phone, bio, institution, degree, yearOfStudy, interests } = req.body;
    try {
        // Check if email is already taken by another user
        if (email) {
            const existingUser = yield user_model_1.default.findOne({
                email,
                _id: { $ne: req.userId }
            });
            if (existingUser) {
                return res.status(400).json({
                    message: "Email is already in use by another account"
                });
            }
        }
        // Update user profile
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(req.userId, {
            $set: {
                firstName,
                lastName,
                email,
                phone,
                bio,
                education: {
                    institution,
                    degree,
                    yearOfStudy
                },
                interests
            }
        }, { new: true, select: "-password" });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
}));
// Update password
exports.updatePassword = (0, handler_1.handleAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { currentPassword, newPassword } = req.body;
    try {
        // Get user with password
        const user = yield user_model_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Verify current password
        const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }
        // Hash new password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, salt);
        // Update password
        user.password = hashedPassword;
        yield user.save();
        res.status(200).json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({
            message: "Failed to update password",
            error: error.message
        });
    }
}));
