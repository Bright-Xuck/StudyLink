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
import { recordQuizAttempt } from "@/lib/actions/progress.actions";
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
 * Get quiz by ID (for students - hides correct answers)
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
 * Submit quiz attempt
 */
export async function submitQuizAttempt(data: {
  quizId: string;
  answers: { questionId: string; answer: string }[];
  timeSpent?: number;
}) {
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

    // Get quiz with correct answers
    const quiz = await Quiz.findById(data.quizId).lean();

    if (!quiz) {
      return {
        success: false,
        error: locale === "fr" ? "Quiz introuvable" : "Quiz not found",
      };
    }

    // Check if user can attempt
    const existingAttempts = await QuizAttempt.find({
      quizId: new mongoose.Types.ObjectId(data.quizId),
      userId: tokenPayload.userId,
    }).countDocuments();

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
    let totalScore = 0;
    let totalPoints = 0;
    const gradedAnswers: IAttemptAnswer[] = [];

    for (const question of quiz.questions) {
      const userAnswer = data.answers.find(
        (a) => a.questionId === question._id?.toString()
      );

      totalPoints += question.points;

      let isCorrect = false;
      let pointsAwarded = 0;

      if (userAnswer) {
        // Normalize answers for comparison (trim, lowercase)
        const normalizedUserAnswer = userAnswer.answer.trim().toLowerCase();
        const normalizedCorrectAnswer = question.correctAnswer
          .trim()
          .toLowerCase();

        if (question.type === "mcq" || question.type === "true-false") {
          // Exact match for MCQ and True/False
          isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
        } else if (question.type === "short-answer") {
          // Flexible matching for short answers
          isCorrect =
            normalizedUserAnswer === normalizedCorrectAnswer ||
            normalizedUserAnswer.includes(normalizedCorrectAnswer) ||
            normalizedCorrectAnswer.includes(normalizedUserAnswer);
        }

        if (isCorrect) {
          pointsAwarded = question.points;
          totalScore += pointsAwarded;
        }
      }

      gradedAnswers.push({
        questionId: question._id?.toString() || "",
        questionText:
          locale === "fr" ? question.questionTextFr : question.questionText,
        userAnswer: userAnswer?.answer || "",
        correctAnswer:
          locale === "fr" && question.correctAnswerFr
            ? question.correctAnswerFr
            : question.correctAnswer,
        isCorrect,
        pointsAwarded,
        pointsPossible: question.points,
      });
    }

    const percentage = Math.round((totalScore / totalPoints) * 100);
    const passed = percentage >= quiz.passingScore;

    // Create quiz attempt
    const attempt = await QuizAttempt.create({
      quizId: quiz._id,
      userId: tokenPayload.userId,
      moduleId: quiz.moduleId,
      score: totalScore,
      totalPoints,
      percentage,
      passed,
      answers: gradedAnswers,
      timeSpent: data.timeSpent,
      attemptNumber: existingAttempts + 1,
      completedAt: new Date(),
    });

    // Record quiz attempt in progress tracking
    await recordQuizAttempt(quiz.moduleId.toString(), {
      quizId: data.quizId,
      score: totalScore,
      totalQuestions: quiz.questions.length,
      passed,
      answers: gradedAnswers.map((a) => ({
        questionId: a.questionId,
        selectedAnswer: a.userAnswer,
        isCorrect: a.isCorrect,
      })),
    });

    return {
      success: true,
      message: passed
        ? locale === "fr"
          ? "Félicitations! Vous avez réussi le quiz."
          : "Congratulations! You passed the quiz."
        : locale === "fr"
        ? `Score: ${percentage}%. Score requis: ${quiz.passingScore}%`
        : `Score: ${percentage}%. Required: ${quiz.passingScore}%`,
      attempt: JSON.parse(JSON.stringify(attempt)),
      passed,
      canRetry: quiz.maxAttempts
        ? existingAttempts + 1 < quiz.maxAttempts
        : true,
      attemptsRemaining: quiz.maxAttempts
        ? quiz.maxAttempts - (existingAttempts + 1)
        : null,
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
 * Get quiz attempt details (for review)
 */
export async function getQuizAttempt(attemptId: string) {
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

    const attempt = await QuizAttempt.findById(attemptId)
      .populate("quizId")
      .lean();

    if (!attempt) {
      return {
        success: false,
        error: locale === "fr" ? "Tentative introuvable" : "Attempt not found",
      };
    }

    // Verify ownership
    if (
      attempt.userId.toString() !== tokenPayload.userId &&
      tokenPayload.role !== "admin"
    ) {
      return {
        success: false,
        error: locale === "fr" ? "Non autorisé" : "Unauthorized",
      };
    }

    return {
      success: true,
      attempt: JSON.parse(JSON.stringify(attempt)),
    };
  } catch (error) {
    console.error("Get quiz attempt error:", error);
    return {
      success: false,
      error: locale === "fr" ? "Erreur de récupération" : "Retrieval error",
    };
  }
}

/**
 * Get user's quiz history for a module
 */
export async function getUserQuizHistory(moduleId: string) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return [];

    await connectDB();

    const attempts = await QuizAttempt.find({
      userId: tokenPayload.userId,
      moduleId: new mongoose.Types.ObjectId(moduleId),
    })
      .populate("quizId")
      .sort({ completedAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(attempts));
  } catch (error) {
    console.error("Get quiz history error:", error);
    return [];
  }
}

/**
 * Get user's best quiz scores for a module
 */
export async function getUserBestScores(moduleId: string) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return [];

    await connectDB();

    // Aggregate to get best score per quiz
    const bestScores = await QuizAttempt.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(tokenPayload.userId),
          moduleId: new mongoose.Types.ObjectId(moduleId),
        },
      },
      {
        $sort: { percentage: -1 },
      },
      {
        $group: {
          _id: "$quizId",
          bestAttempt: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$bestAttempt" },
      },
    ]);

    return JSON.parse(JSON.stringify(bestScores));
  } catch (error) {
    console.error("Get best scores error:", error);
    return [];
  }
}

/**
 * Update quiz (admin only)
 */
export async function updateQuiz(
  quizId: string,
  data: {
    title?: string;
    titleFr?: string;
    description?: string;
    descriptionFr?: string;
    questions?: IQuestion[];
    passingScore?: number;
    timeLimit?: number;
    maxAttempts?: number;
    isPublished?: boolean;
  }
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

    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!quiz) {
      return {
        success: false,
        error: locale === "fr" ? "Quiz introuvable" : "Quiz not found",
      };
    }

    return {
      success: true,
      message:
        locale === "fr"
          ? "Quiz mis à jour avec succès"
          : "Quiz updated successfully",
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
 * Delete quiz (admin only)
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

    const quiz = await Quiz.findByIdAndDelete(quizId);

    if (!quiz) {
      return {
        success: false,
        error: locale === "fr" ? "Quiz introuvable" : "Quiz not found",
      };
    }

    // Also delete all attempts
    await QuizAttempt.deleteMany({
      quizId: new mongoose.Types.ObjectId(quizId),
    });

    return {
      success: true,
      message:
        locale === "fr"
          ? "Quiz supprimé avec succès"
          : "Quiz deleted successfully",
    };
  } catch (error) {
    console.error("Delete quiz error:", error);
    return {
      success: false,
      error: locale === "fr" ? "Erreur de suppression" : "Deletion error",
    };
  }
}

/**
 * Get quiz statistics (admin only)
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

    const stats = await QuizAttempt.aggregate([
      {
        $match: {
          quizId: new mongoose.Types.ObjectId(quizId),
        },
      },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          uniqueStudents: { $addToSet: "$userId" },
          averageScore: { $avg: "$percentage" },
          highestScore: { $max: "$percentage" },
          lowestScore: { $min: "$percentage" },
          passedCount: {
            $sum: { $cond: ["$passed", 1, 0] },
          },
          failedCount: {
            $sum: { $cond: ["$passed", 0, 1] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalAttempts: 1,
          uniqueStudents: { $size: "$uniqueStudents" },
          averageScore: { $round: ["$averageScore", 2] },
          highestScore: 1,
          lowestScore: 1,
          passedCount: 1,
          failedCount: 1,
          passRate: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$passedCount", "$totalAttempts"] },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },
    ]);

    return {
      success: true,
      statistics: stats.length > 0 ? stats[0] : null,
    };
  } catch (error) {
    console.error("Get quiz statistics error:", error);
    return {
      success: false,
      error: locale === "fr" ? "Erreur de statistiques" : "Statistics error",
    };
  }
}
