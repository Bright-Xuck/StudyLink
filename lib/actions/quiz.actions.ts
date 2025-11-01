"use server";

import { connectDB } from "@/lib/db";
import {
  Quiz,
  QuizAttempt,
  IQuestion,
  IAttemptAnswer,
} from "@/lib/models/Quiz";
import Module from "@/lib/models/Module";
import { getCurrentUser } from "@/lib/utils/jwt";
import { recordQuizAttempt as recordProgressQuizAttempt } from "@/lib/actions/progress.actions";
import { getLocale } from "next-intl/server";
import mongoose from "mongoose";

/**
 * Create a new quiz for a lesson
 */
export async function createQuiz(data: {
  lessonId: string;
  moduleId: string;
  title: string;
  titleFr: string;
  description?: string;
  descriptionFr?: string;
  questions: IQuestion[];
  passingScore?: number;
  timeLimit?: number;
  maxAttempts?: number;
}) {
  const locale = await getLocale();

  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload || tokenPayload.role !== "admin") {
      return {
        success: false,
        error: locale === "fr" ? "Non autorisé" : "Unauthorized",
      };
    }

    await connectDB();

    // Validate module exists
    const courseModule = await Module.findById(data.moduleId);
    if (!courseModule) {
      return {
        success: false,
        error: locale === "fr" ? "Module introuvable" : "Module not found",
      };
    }

    // Create quiz
    const quiz = await Quiz.create({
      lessonId: new mongoose.Types.ObjectId(data.lessonId),
      moduleId: new mongoose.Types.ObjectId(data.moduleId),
      title: data.title,
      titleFr: data.titleFr,
      description: data.description,
      descriptionFr: data.descriptionFr,
      questions: data.questions,
      passingScore: data.passingScore || 85,
      timeLimit: data.timeLimit,
      maxAttempts: data.maxAttempts || 3,
      isPublished: true,
    });

    return {
      success: true,
      message:
        locale === "fr" ? "Quiz créé avec succès" : "Quiz created successfully",
      quiz: JSON.parse(JSON.stringify(quiz)),
    };
  } catch (error) {
    console.error("Create quiz error:", error);
    return {
      success: false,
      error: locale === "fr" ? "Erreur de création" : "Creation error",
    };
  }
}

/**
 * Get quiz by ID
 */
export async function getQuizById(quizId: string) {
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

    const quiz = await Quiz.findById(quizId).lean();

    if (!quiz) {
      return {
        success: false,
        error: locale === "fr" ? "Quiz introuvable" : "Quiz not found",
      };
    }

    // For students, hide correct answers and explanations
    if (tokenPayload.role !== "admin") {
      quiz.questions = quiz.questions.map((q) => ({
        ...q,
        correctAnswer: "", // Hide
        correctAnswerFr: "", // Hide
        explanation: "", // Hide until after attempt
        explanationFr: "", // Hide until after attempt
      }));
    }

    // Get user's attempts
    const attempts = await QuizAttempt.find({
      quizId: new mongoose.Types.ObjectId(quizId),
      userId: tokenPayload.userId,
    })
      .sort({ attemptNumber: -1 })
      .lean();

    // Check if user can attempt
    const canAttempt = quiz.maxAttempts
      ? attempts.length < quiz.maxAttempts
      : true;

    // Get best attempt
    const bestAttempt =
      attempts.length > 0
        ? attempts.reduce((best, current) =>
            current.percentage > best.percentage ? current : best
          )
        : null;

    return {
      success: true,
      quiz: JSON.parse(JSON.stringify(quiz)),
      attempts: JSON.parse(JSON.stringify(attempts)),
      canAttempt,
      bestAttempt: bestAttempt ? JSON.parse(JSON.stringify(bestAttempt)) : null,
      attemptsRemaining: quiz.maxAttempts
        ? quiz.maxAttempts - attempts.length
        : null,
    };
  } catch (error) {
    console.error("Get quiz error:", error);
    return {
      success: false,
      error: locale === "fr" ? "Erreur de récupération" : "Retrieval error",
    };
  }
}

/**
 * Get quiz by lesson ID
 */
export async function getQuizByLessonId(lessonId: string) {
  try {
    await connectDB();

    const quiz = await Quiz.findOne({
      lessonId: new mongoose.Types.ObjectId(lessonId),
      isPublished: true,
    }).lean();

    if (!quiz) {
      return null;
    }

    return JSON.parse(JSON.stringify(quiz));
  } catch (error) {
    console.error("Get quiz by lesson error:", error);
    return null;
  }
}

/**
 * Get all quizzes for a module
 */
export async function getModuleQuizzes(moduleId: string) {
  try {
    await connectDB();

    const quizzes = await Quiz.find({
      moduleId: new mongoose.Types.ObjectId(moduleId),
      isPublished: true,
    })
      .sort({ createdAt: 1 })
      .lean();

    return JSON.parse(JSON.stringify(quizzes));
  } catch (error) {
    console.error("Get module quizzes error:", error);
    return [];
  }
}

/**
 * Get all quizzes for a course (NEW!)
 */
export async function getCourseQuizzes(courseId: string) {
  try {
    await connectDB();

    // Get all modules in the course
    const modules = await Module.find({
      courseId: new mongoose.Types.ObjectId(courseId),
      isPublished: true,
    }).lean();

    const moduleIds = modules.map((m) => m._id);

    // Get all quizzes for those modules
    const quizzes = await Quiz.find({
      moduleId: { $in: moduleIds },
      isPublished: true,
    })
      .populate("moduleId")
      .sort({ createdAt: 1 })
      .lean();

    return JSON.parse(JSON.stringify(quizzes));
  } catch (error) {
    console.error("Get course quizzes error:", error);
    return [];
  }
}

/**
 * Submit quiz attempt
 */
export async function submitQuizAttempt(
  courseId: string,
  moduleId: string,
  quizData: {
    quizId: string;
    lessonOrder?: number;
    score?: number;
    totalQuestions: number;
    passed?: boolean;
    answers: { questionId: string; answer: string }[];
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

    // Get quiz
    const quiz = await Quiz.findById(quizData.quizId).lean();
    if (!quiz) {
      return {
        success: false,
        error: locale === "fr" ? "Quiz introuvable" : "Quiz not found",
      };
    }

    // Get module to find course
    const courseModule = await Module.findById(quiz.moduleId).lean();
    if (!courseModule) {
      return {
        success: false,
        error: locale === "fr" ? "Module introuvable" : "Module not found",
      };
    }

    // Check if user can attempt
    const existingAttempts = await QuizAttempt.countDocuments({
      quizId: new mongoose.Types.ObjectId(quizData.quizId),
      userId: tokenPayload.userId,
    });

    if (quiz.maxAttempts && existingAttempts >= quiz.maxAttempts) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Nombre maximum de tentatives atteint"
            : "Maximum attempts reached",
      };
    }

    // Grade the quiz
    const gradedAnswers: IAttemptAnswer[] = [];
    let totalScore = 0;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    for (const question of quiz.questions) {
      const userAnswer = quizData.answers.find(
        (a) => a.questionId === question._id?.toString()
      );

      const isCorrect = userAnswer
        ? userAnswer.answer.trim().toLowerCase() ===
          question.correctAnswer.trim().toLowerCase()
        : false;

      const pointsAwarded = isCorrect ? question.points : 0;
      totalScore += pointsAwarded;

      gradedAnswers.push({
        questionId: question._id?.toString() || "",
        questionText: question.questionText,
        userAnswer: userAnswer?.answer || "",
        correctAnswer: question.correctAnswer,
        isCorrect,
        pointsAwarded,
        pointsPossible: question.points,
      });
    }

    const percentage = Math.round((totalScore / totalPoints) * 100);
    const passed = percentage >= quiz.passingScore;

    // Save attempt
    const attempt = await QuizAttempt.create({
      quizId: new mongoose.Types.ObjectId(quizData.quizId),
      userId: tokenPayload.userId,
      moduleId: quiz.moduleId,
      score: totalScore,
      totalPoints,
      percentage,
      passed,
      answers: gradedAnswers,
      attemptNumber: existingAttempts + 1,
      completedAt: new Date(),
    });

    // Record in progress tracking (course-level)
    await recordProgressQuizAttempt(
      courseId,
      moduleId,
      {
        quizId: quiz._id.toString(),
        lessonOrder: quizData.lessonOrder, // Use from quizData
        score: totalScore,
        totalQuestions: quiz.questions.length,
        passed,
        answers: gradedAnswers.map((a) => ({
          questionId: a.questionId,
          selectedAnswer: a.userAnswer,
          isCorrect: a.isCorrect,
        })),
      }
    );

    return {
      success: true,
      message: passed
        ? locale === "fr"
          ? "Félicitations! Vous avez réussi le quiz."
          : "Congratulations! You passed the quiz."
        : locale === "fr"
        ? "Quiz terminé. Continuez à pratiquer!"
        : "Quiz completed. Keep practicing!",
      attempt: JSON.parse(JSON.stringify(attempt)),
    };
  } catch (error) {
    console.error("Submit quiz attempt error:", error);
    return {
      success: false,
      error: locale === "fr" ? "Erreur de soumission" : "Submission error",
    };
  }
}

/**
 * Get user's quiz attempts
 */
export async function getUserQuizAttempts(quizId: string) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return [];

    await connectDB();

    const attempts = await QuizAttempt.find({
      quizId: new mongoose.Types.ObjectId(quizId),
      userId: tokenPayload.userId,
    })
      .sort({ attemptNumber: -1 })
      .lean();

    return JSON.parse(JSON.stringify(attempts));
  } catch (error) {
    console.error("Get user quiz attempts error:", error);
    return [];
  }
}

/**
 * Get quiz attempt by ID
 */
export async function getQuizAttemptById(attemptId: string) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return null;

    await connectDB();

    const attempt = await QuizAttempt.findOne({
      _id: attemptId,
      userId: tokenPayload.userId,
    })
      .populate("quizId")
      .lean();

    return attempt ? JSON.parse(JSON.stringify(attempt)) : null;
  } catch (error) {
    console.error("Get quiz attempt error:", error);
    return null;
  }
}

/**
 * Get user's best quiz score
 */
export async function getUserBestQuizScore(quizId: string) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return null;

    await connectDB();

    const bestAttempt = await QuizAttempt.findOne({
      quizId: new mongoose.Types.ObjectId(quizId),
      userId: tokenPayload.userId,
    })
      .sort({ percentage: -1 })
      .lean();

    return bestAttempt ? JSON.parse(JSON.stringify(bestAttempt)) : null;
  } catch (error) {
    console.error("Get best quiz score error:", error);
    return null;
  }
}

/**
 * Get quiz statistics for admin
 */
export async function getQuizStatistics(quizId: string) {
  const locale = await getLocale();

  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload || tokenPayload.role !== "admin") {
      return {
        success: false,
        error: locale === "fr" ? "Non autorisé" : "Unauthorized",
      };
    }

    await connectDB();

    const attempts = await QuizAttempt.find({
      quizId: new mongoose.Types.ObjectId(quizId),
    }).lean();

    if (!attempts.length) {
      return {
        success: true,
        statistics: {
          totalAttempts: 0,
          uniqueUsers: 0,
          averageScore: 0,
          passRate: 0,
          highestScore: 0,
          lowestScore: 0,
        },
      };
    }

    const uniqueUsers = new Set(attempts.map((a) => a.userId.toString())).size;
    const passedAttempts = attempts.filter((a) => a.passed).length;
    const scores = attempts.map((a) => a.percentage);
    const averageScore =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;

    return {
      success: true,
      statistics: {
        totalAttempts: attempts.length,
        uniqueUsers,
        averageScore: Math.round(averageScore),
        passRate: Math.round((passedAttempts / attempts.length) * 100),
        highestScore: Math.max(...scores),
        lowestScore: Math.min(...scores),
      },
    };
  } catch (error) {
    console.error("Get quiz statistics error:", error);
    return {
      success: false,
      error: locale === "fr" ? "Erreur de statistiques" : "Statistics error",
    };
  }
}

/**
 * Update quiz
 */
export async function updateQuiz(
  quizId: string,
  data: Partial<{
    title: string;
    titleFr: string;
    description: string;
    descriptionFr: string;
    questions: IQuestion[];
    passingScore: number;
    timeLimit: number;
    maxAttempts: number;
    isPublished: boolean;
  }>
) {
  const locale = await getLocale();

  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload || tokenPayload.role !== "admin") {
      return {
        success: false,
        error: locale === "fr" ? "Non autorisé" : "Unauthorized",
      };
    }

    await connectDB();

    const quiz = await Quiz.findByIdAndUpdate(quizId, data, { new: true });

    if (!quiz) {
      return {
        success: false,
        error: locale === "fr" ? "Quiz introuvable" : "Quiz not found",
      };
    }

    return {
      success: true,
      message: locale === "fr" ? "Quiz mis à jour" : "Quiz updated",
      quiz: JSON.parse(JSON.stringify(quiz)),
    };
  } catch (error) {
    console.error("Update quiz error:", error);
    return {
      success: false,
      error: locale === "fr" ? "Erreur de mise à jour" : "Update error",
    };
  }
}

/**
 * Delete quiz
 */
export async function deleteQuiz(quizId: string) {
  const locale = await getLocale();

  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload || tokenPayload.role !== "admin") {
      return {
        success: false,
        error: locale === "fr" ? "Non autorisé" : "Unauthorized",
      };
    }

    await connectDB();

    // Delete quiz and all attempts
    await Promise.all([
      Quiz.findByIdAndDelete(quizId),
      QuizAttempt.deleteMany({ quizId: new mongoose.Types.ObjectId(quizId) }),
    ]);

    return {
      success: true,
      message: locale === "fr" ? "Quiz supprimé" : "Quiz deleted",
    };
  } catch (error) {
    console.error("Delete quiz error:", error);
    return {
      success: false,
      error: locale === "fr" ? "Erreur de suppression" : "Deletion error",
    };
  }
}
