import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { ExtendedRequest } from "../middleware/auth.middleware";
import { handleAsync } from "../utils/handler";
import bcrypt from "bcryptjs";

// Update user profile
export const updateProfile = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      bio,
      institution,
      degree,
      yearOfStudy,
      interests
    } = req.body;

    try {
      // Check if email is already taken by another user
      if (email) {
        const existingUser = await User.findOne({ 
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
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        {
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
        },
        { new: true, select: "-password" }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ 
        message: "Failed to update profile",
        error: (error as Error).message 
      });
    }
  }
);

// Update password
export const updatePassword = handleAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;

    try {
      // Get user with password
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ 
        message: "Failed to update password",
        error: (error as Error).message 
      });
    }
  }
); 