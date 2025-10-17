"use server";

import { connectDB } from "@/lib/db";
import Progress, { IProgress } from "@/lib/models/Progress";
import Module from "@/lib/models/Module";
import { getCurrentUser } from "@/lib/utils/jwt";
import { getLocale } from "next-intl/server";
import mongoose from "mongoose";

/**
 * Initialize progress tracking when user starts a module
 */
export async function initializeModuleProgress(moduleId: string) {
  const locale = await getLocale();

  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) {
      return {
        success: false,
        error: locale === "fr" ? "Non authentifié" : "Not authenticated",
      };
    }

    await connectDB();

    // Get module to count lessons
    const courseModule = await Module.findById(moduleId);
    if (!courseModule) {
      return {
        success: false,
        error: locale === "fr" ? "Module introuvable" : "Module not found",
      };
    }

    // Check if progress already exists
    const existingProgress = await Progress.findOne({
      userId: tokenPayload.userId,
      moduleId: new mongoose.Types.ObjectId(moduleId),
    });

    if (existingProgress) {
      return {
        success: true,
        progress: existingProgress,
      };
    }

    // Initialize lessons progress
    const lessonsProgress = courseModule.lessons.map((lesson) => ({
      lessonOrder: lesson.order,
      completed: false,
      timeSpent: 0,
      lastAccessedAt: new Date(),
    }));

    // Create new progress record
    const progress = await Progress.create({
      userId: tokenPayload.userId,
      moduleId: new mongoose.Types.ObjectId(moduleId),
      lessonsProgress,
      totalLessons: courseModule.lessons.length,
      completedLessons: 0,
      progressPercentage: 0,
      startedAt: new Date(),
    });

    return {
      success: true,
      progress: JSON.parse(JSON.stringify(progress)),
    };
  } catch (error) {
    console.error("Initialize progress error:", error);
    return {
      success: false,
      error:
        locale === "fr"
          ? "Erreur lors de l'initialisation"
          : "Initialization error",
    };
  }
}

/**
 * Mark a lesson as completed
 */
export async function markLessonComplete(
  moduleId: string,
  lessonOrder: number,
  timeSpent: number = 0
) {
  const locale = await getLocale();

  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) {
      return {
        success: false,
        error: locale === "fr" ? "Non authentifié" : "Not authenticated",
      };
    }

    await connectDB();

    // Find or create progress
    let progress = (await Progress.findOne({
      userId: tokenPayload.userId,
      moduleId: new mongoose.Types.ObjectId(moduleId),
    })) as IProgress | null;

    if (!progress) {
      // Initialize progress first
      const initResult = await initializeModuleProgress(moduleId);
      if (!initResult.success) {
        return initResult;
      }
      progress = (await Progress.findOne({
        userId: tokenPayload.userId,
        moduleId: new mongoose.Types.ObjectId(moduleId),
      })) as IProgress | null;
    }

    if (!progress) {
      return {
        success: false,
        error:
          locale === "fr" ? "Progression introuvable" : "Progress not found",
      };
    }

    // Find the lesson in progress
    const lessonProgress = progress.lessonsProgress.find(
      (lp) => lp.lessonOrder === lessonOrder
    );

    if (!lessonProgress) {
      return {
        success: false,
        error: locale === "fr" ? "Leçon introuvable" : "Lesson not found",
      };
    }

    // Update lesson progress
    lessonProgress.completed = true;
    lessonProgress.completedAt = new Date();
    lessonProgress.timeSpent += timeSpent;
    lessonProgress.lastAccessedAt = new Date();

    // Update overall progress
    await progress.updateProgress();

    return {
      success: true,
      message: locale === "fr" ? "Leçon complétée!" : "Lesson completed!",
      progress: JSON.parse(JSON.stringify(progress)),
    };
  } catch (error) {
    console.error("Mark lesson complete error:", error);
    return {
      success: false,
      error: locale === "fr" ? "Erreur de mise à jour" : "Update error",
    };
  }
}

/**
 * Update lesson time spent
 */
export async function updateLessonTime(
  moduleId: string,
  lessonOrder: number,
  additionalTime: number
) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return { success: false };

    await connectDB();

    const progress = (await Progress.findOne({
      userId: tokenPayload.userId,
      moduleId: new mongoose.Types.ObjectId(moduleId),
    })) as IProgress | null;

    if (!progress) return { success: false };

    const lessonProgress = progress.lessonsProgress.find(
      (lp) => lp.lessonOrder === lessonOrder
    );

    if (!lessonProgress) return { success: false };

    lessonProgress.timeSpent += additionalTime;
    lessonProgress.lastAccessedAt = new Date();

    await progress.save();

    return { success: true };
  } catch (error) {
    console.error("Update lesson time error:", error);
    return { success: false };
  }
}

/**
 * Get user's progress for a specific module
 */
export async function getModuleProgress(moduleId: string) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return null;

    await connectDB();

    const progress = await Progress.findOne({
      userId: tokenPayload.userId,
      moduleId: new mongoose.Types.ObjectId(moduleId),
    }).lean();

    if (!progress) return null;

    return JSON.parse(JSON.stringify(progress));
  } catch (error) {
    console.error("Get module progress error:", error);
    return null;
  }
}

/**
 * Get all user's progress across all modules
 */
export async function getAllUserProgress() {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return [];

    await connectDB();

    const progressRecords = await Progress.find({
      userId: tokenPayload.userId,
    })
      .populate("moduleId")
      .sort({ lastAccessedAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(progressRecords));
  } catch (error) {
    console.error("Get all progress error:", error);
    return [];
  }
}

/**
 * Record quiz attempt
 */
export async function recordQuizAttempt(
  moduleId: string,
  quizData: {
    quizId: string;
    score: number;
    totalQuestions: number;
    passed: boolean;
    answers: {
      questionId: string;
      selectedAnswer: string;
      isCorrect: boolean;
    }[];
  }
) {
  const locale = await getLocale();

  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) {
      return {
        success: false,
        error: locale === "fr" ? "Non authentifié" : "Not authenticated",
      };
    }

    await connectDB();

    const progress = (await Progress.findOne({
      userId: tokenPayload.userId,
      moduleId: new mongoose.Types.ObjectId(moduleId),
    })) as IProgress | null;

    if (!progress) {
      return {
        success: false,
        error:
          locale === "fr" ? "Progression introuvable" : "Progress not found",
      };
    }

    // Add quiz attempt
    progress.quizAttempts.push({
      ...quizData,
      attemptedAt: new Date(),
    });

    // Update best score
    if (quizData.score > progress.bestQuizScore) {
      progress.bestQuizScore = quizData.score;
    }

    // Update quiz passed status
    if (quizData.passed && !progress.quizPassed) {
      progress.quizPassed = true;
    }

    await progress.updateProgress();

    return {
      success: true,
      message: quizData.passed
        ? locale === "fr"
          ? "Quiz réussi!"
          : "Quiz passed!"
        : locale === "fr"
        ? "Quiz terminé"
        : "Quiz completed",
      progress: JSON.parse(JSON.stringify(progress)),
    };
  } catch (error) {
    console.error("Record quiz attempt error:", error);
    return {
      success: false,
      error: locale === "fr" ? "Erreur d'enregistrement" : "Recording error",
    };
  }
}

/**
 * Get user statistics
 */
export async function getUserStats() {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return null;

    await connectDB();

    const progressRecords = await Progress.find({
      userId: tokenPayload.userId,
    }).lean();

    const totalModules = progressRecords.length;
    const completedModules = progressRecords.filter(
      (p) => p.completedAt
    ).length;
    const inProgressModules = totalModules - completedModules;

    const totalLessonsCompleted = progressRecords.reduce(
      (sum, p) => sum + p.completedLessons,
      0
    );

    const totalTimeSpent = progressRecords.reduce((sum, p) => {
      return (
        sum +
        p.lessonsProgress.reduce((lessonSum, lp) => lessonSum + lp.timeSpent, 0)
      );
    }, 0);

    const certificatesEarned = progressRecords.filter(
      (p) => p.certificateIssued
    ).length;

    return {
      totalModules,
      completedModules,
      inProgressModules,
      totalLessonsCompleted,
      totalTimeSpent,
      certificatesEarned,
    };
  } catch (error) {
    console.error("Get user stats error:", error);
    return null;
  }
}
