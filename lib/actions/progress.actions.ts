"use server";

import { connectDB } from "@/lib/db";
import Progress, { IProgress } from "@/lib/models/Progress";
import Course from "@/lib/models/Course";
import Module from "@/lib/models/Module";
import { getCurrentUser } from "@/lib/utils/jwt";
import { getLocale } from "next-intl/server";
import mongoose from "mongoose";

interface PopulatedModule {
  _id: mongoose.Types.ObjectId | string;
  lessons: { order: number; hasQuiz?: boolean }[];
}

/**
 * Initialize progress tracking when user starts a course
 */
export async function initializeCourseProgress(courseId: string) {
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

    // Get course with modules
    const course = await Course.findById(courseId).populate("modules");
    if (!course) {
      return {
        success: false,
        error: locale === "fr" ? "Cours introuvable" : "Course not found",
      };
    }

    // Check if progress already exists
    const existingProgress = await Progress.findOne({
      userId: tokenPayload.userId,
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    if (existingProgress) {
      return {
        success: true,
        progress: JSON.parse(JSON.stringify(existingProgress)),
      };
    }

    // Initialize progress for all modules and lessons
    const modulesProgress = [];
    const lessonsProgress = [];
    let totalLessons = 0;
    let totalQuizzes = 0;

    for (const moduleData of course.modules as unknown as PopulatedModule[]) {
      const courseModule = await Module.findById(moduleData._id || moduleData);
      if (!courseModule) continue;

      // Track module progress
      modulesProgress.push({
        moduleId: courseModule._id,
        completedLessons: 0,
        totalLessons: courseModule.lessons.length,
        progressPercentage: 0,
        completed: false,
      });

      // Track lesson progress
      for (const lesson of courseModule.lessons) {
        lessonsProgress.push({
          moduleId: courseModule._id.toString(),
          lessonOrder: lesson.order,
          completed: false,
          timeSpent: 0,
          lastAccessedAt: new Date(),
          quizPassed: false,
        });
        totalLessons++;
        if (lesson.hasQuiz) {
          totalQuizzes++;
        }
      }
    }

    // Create new progress record
    const progress = await Progress.create({
      userId: tokenPayload.userId,
      courseId: new mongoose.Types.ObjectId(courseId),
      modulesProgress,
      lessonsProgress,
      totalModules: course.modules.length,
      completedModules: 0,
      totalLessons,
      completedLessons: 0,
      courseProgressPercentage: 0,
      quizAttempts: [],
      totalQuizzesPassed: 0,
      totalQuizzesRequired: totalQuizzes,
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
  courseId: string,
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
      courseId: new mongoose.Types.ObjectId(courseId),
    })) as IProgress | null;

    if (!progress) {
      // Initialize progress first
      const initResult = await initializeCourseProgress(courseId);
      if (!initResult.success) {
        return initResult;
      }
      progress = (await Progress.findOne({
        userId: tokenPayload.userId,
        courseId: new mongoose.Types.ObjectId(courseId),
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
      (lp) => lp.moduleId === moduleId && lp.lessonOrder === lessonOrder
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
  courseId: string,
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
      courseId: new mongoose.Types.ObjectId(courseId),
    })) as IProgress | null;

    if (!progress) return { success: false };

    const lessonProgress = progress.lessonsProgress.find(
      (lp) => lp.moduleId === moduleId && lp.lessonOrder === lessonOrder
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

interface ModuleProgressData {
  moduleId: mongoose.Types.ObjectId | string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  completed: boolean;
  completedAt?: Date;
}

interface LessonProgressData {
  moduleId: string;
  lessonOrder: number;
  completed: boolean;
  completedAt?: Date;
  timeSpent: number;
  lastAccessedAt: Date;
  quizPassed: boolean;
  quizScore?: number;
}

interface QuizAttemptData {
  quizId: string;
  moduleId: string;
  lessonOrder?: number;
  score: number;
  totalQuestions: number;
  passed: boolean;
  attemptedAt: Date;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
}

/**
 * Get user's progress for a specific course
 */
export async function getCourseProgress(courseId: string) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return null;

    await connectDB();

    const progress = await Progress.findOne({
      userId: tokenPayload.userId,
      courseId: new mongoose.Types.ObjectId(courseId),
    })
      .populate("courseId")
      .lean();

    if (!progress) return null;

    return JSON.parse(JSON.stringify(progress));
  } catch (error) {
    console.error("Get course progress error:", error);
    return null;
  }
}

/**
 * Get user's progress for a specific module within a course
 */
export async function getModuleProgress(courseId: string, moduleId: string) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return null;

    await connectDB();

    const progress = await Progress.findOne({
      userId: tokenPayload.userId,
      courseId: new mongoose.Types.ObjectId(courseId),
    }).lean();

    if (!progress) return null;

    // Find module progress
    const moduleProgress = (
      progress.modulesProgress as ModuleProgressData[]
    ).find((mp) => mp.moduleId.toString() === moduleId);

    if (!moduleProgress) return null;

    // Get lesson progress for this module
    const lessonProgress = (
      progress.lessonsProgress as LessonProgressData[]
    ).filter((lp) => lp.moduleId === moduleId);

    return {
      moduleProgress,
      lessonProgress,
      quizAttempts: (progress.quizAttempts as QuizAttemptData[]).filter(
        (qa) => qa.moduleId === moduleId
      ),
    };
  } catch (error) {
    console.error("Get module progress error:", error);
    return null;
  }
}

/**
 * Get all user's progress across all courses
 */
export async function getAllUserProgress() {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return [];

    await connectDB();

    const progressRecords = await Progress.find({
      userId: tokenPayload.userId,
    })
      .populate("courseId")
      .sort({ lastAccessedAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(progressRecords));
  } catch (error) {
    console.error("Get all progress error:", error);
    return [];
  }
}

/**
 * Record quiz attempt for a lesson
 */
export async function recordQuizAttempt(
  courseId: string,
  moduleId: string,
  quizData: {
    quizId: string;
    lessonOrder?: number;
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
      courseId: new mongoose.Types.ObjectId(courseId),
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
      moduleId,
      attemptedAt: new Date(),
    });

    // Update lesson quiz status if passed
    if (quizData.passed && quizData.lessonOrder !== undefined) {
      const lessonProgress = progress.lessonsProgress.find(
        (lp) =>
          lp.moduleId === moduleId && lp.lessonOrder === quizData.lessonOrder
      );
      if (lessonProgress) {
        lessonProgress.quizPassed = true;
        lessonProgress.quizScore = quizData.score;
      }
    }

    // Update progress
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

interface ProgressRecord {
  completedAt?: Date;
  completedModules: number;
  completedLessons: number;
  totalQuizzesPassed: number;
  certificateIssued: boolean;
  lessonsProgress: LessonProgressData[];
}

/**
 * Get user statistics across all courses
 */
export async function getUserStats() {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return null;

    await connectDB();

    const progressRecords = await Progress.find({
      userId: tokenPayload.userId,
    }).lean();

    const typedRecords = progressRecords as unknown as ProgressRecord[];

    const totalCourses = typedRecords.length;
    const completedCourses = typedRecords.filter((p) => p.completedAt).length;
    const inProgressCourses = totalCourses - completedCourses;

    const totalModulesCompleted = typedRecords.reduce(
      (sum, p) => sum + p.completedModules,
      0
    );

    const totalLessonsCompleted = typedRecords.reduce(
      (sum, p) => sum + p.completedLessons,
      0
    );

    const totalTimeSpent = typedRecords.reduce((sum, p) => {
      return (
        sum +
        p.lessonsProgress.reduce((lessonSum, lp) => lessonSum + lp.timeSpent, 0)
      );
    }, 0);

    const totalQuizzesPassed = typedRecords.reduce(
      (sum, p) => sum + p.totalQuizzesPassed,
      0
    );

    const certificatesEarned = typedRecords.filter(
      (p) => p.certificateIssued
    ).length;

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalModulesCompleted,
      totalLessonsCompleted,
      totalQuizzesPassed,
      totalTimeSpent,
      certificatesEarned,
    };
  } catch (error) {
    console.error("Get user stats error:", error);
    return null;
  }
}

/**
 * Get course completion percentage
 */
export async function getCourseCompletionPercentage(courseId: string) {
  try {
    const progress = await getCourseProgress(courseId);
    if (!progress) return 0;
    return progress.courseProgressPercentage || 0;
  } catch (error) {
    console.error("Get completion percentage error:", error);
    return 0;
  }
}

/**
 * Check if user can get certificate for a course
 */
export async function canGetCertificate(courseId: string) {
  try {
    const progress = await getCourseProgress(courseId);

    if (!progress) {
      return {
        canGet: false,
        reason: "no_progress",
      };
    }

    if (progress.certificateIssued) {
      return {
        canGet: true,
        alreadyIssued: true,
        certificateId: progress.certificateId,
      };
    }

    // Check requirements
    const allLessonsCompleted = progress.courseProgressPercentage === 100;
    const allQuizzesPassed =
      progress.totalQuizzesPassed >= progress.totalQuizzesRequired;

    if (allLessonsCompleted && allQuizzesPassed) {
      return {
        canGet: true,
        alreadyIssued: false,
      };
    }

    return {
      canGet: false,
      reason: "requirements_not_met",
      details: {
        progressPercentage: progress.courseProgressPercentage,
        quizzesPassed: progress.totalQuizzesPassed,
        quizzesRequired: progress.totalQuizzesRequired,
      },
    };
  } catch (error) {
    console.error("Check certificate eligibility error:", error);
    return {
      canGet: false,
      reason: "error",
    };
  }
}
