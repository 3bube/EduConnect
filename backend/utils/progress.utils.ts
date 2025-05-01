import mongoose from "mongoose";
import Course from "../models/course.model";
import CourseProgress from "../models/courseProgress.model";

/**
 * Calculates the progress percentage for a course based on completed lessons
 * @param courseId - The ID of the course
 * @param completedLessonIds - Array of completed lesson IDs
 * @returns Progress percentage (0-100)
 */
export const calculateCourseProgress = async (
  courseId: string | mongoose.Types.ObjectId,
  completedLessonIds: string[] | mongoose.Types.ObjectId[]
): Promise<number> => {
  try {
    // Get the course to count total lessons
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`);
    }

    // Count total lessons in the course
    const totalLessons = course.lessons?.length || 0;
    if (totalLessons === 0) {
      return 0; // No lessons in the course
    }

    // Calculate progress percentage
    const completedCount = completedLessonIds.length;
    const progressPercentage = Math.round((completedCount / totalLessons) * 100);
    
    // Ensure progress is between 0 and 100
    return Math.min(Math.max(progressPercentage, 0), 100);
  } catch (error) {
    console.error("Error calculating course progress:", error);
    return 0; // Default to 0% on error
  }
};

/**
 * Updates or creates a course progress record for a user
 * @param userId - The user ID
 * @param courseId - The course ID
 * @param lessonId - The lesson ID that was completed (optional)
 * @returns The updated course progress record
 */
export const updateUserCourseProgress = async (
  userId: string | mongoose.Types.ObjectId,
  courseId: string | mongoose.Types.ObjectId,
  lessonId?: string | mongoose.Types.ObjectId
): Promise<any> => {
  try {
    // Find existing progress record or create a new one
    let progress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (!progress) {
      // Create new progress record if none exists
      progress = new CourseProgress({
        userId,
        courseId,
        completedLessons: [],
        completedAssignments: [],
        progress: 0,
        timeSpent: 0,
        lastAccessed: new Date(),
        startDate: new Date(),
      });
    }

    // Update last accessed timestamp
    progress.lastAccessed = new Date();

    // If a lesson ID was provided, mark it as completed
    if (lessonId) {
      // Store the lesson ID as a string to avoid ObjectId conversion issues
      const lessonIdString = lessonId.toString();
      
      // Check if lesson is already marked as completed
      const lessonAlreadyCompleted = progress.completedLessons.some(
        (id) => id.toString() === lessonIdString
      );

      // Add lesson to completed lessons if not already completed
      if (!lessonAlreadyCompleted) {
        progress.completedLessons.push(lessonIdString);
      }
    }

    // Calculate and update progress percentage
    progress.progress = await calculateCourseProgress(
      courseId,
      progress.completedLessons
    );

    // Save the updated progress
    await progress.save();
    return progress;
  } catch (error) {
    console.error("Error updating user course progress:", error);
    throw error;
  }
};

/**
 * Gets the course progress for a specific user and course
 * @param userId - The user ID
 * @param courseId - The course ID
 * @returns The course progress record or null if not found
 */
export const getUserCourseProgress = async (
  userId: string | mongoose.Types.ObjectId,
  courseId: string | mongoose.Types.ObjectId
): Promise<any> => {
  try {
    return await CourseProgress.findOne({
      userId,
      courseId,
    });
  } catch (error) {
    console.error("Error getting user course progress:", error);
    return null;
  }
};
