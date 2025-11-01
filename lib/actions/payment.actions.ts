"use server";

import { connectDB } from "@/lib/db";
import Payment from "@/lib/models/Payment";
import User from "@/lib/models/User";
import Course from "@/lib/models/Course";
import { getCurrentUser } from "@/lib/utils/jwt";
import { fapshiClient } from "@/lib/utils/fapshi";
import { getLocale } from "next-intl/server";
import mongoose from "mongoose";
import crypto from "crypto";

/**
 * Initiate a direct payment for a course
 */
export async function initiateCoursePayment(
  courseId: string,
  phone: string,
  medium: "mobile money" | "orange money" = "mobile money"
) {
  const locale = await getLocale();

  try {
    // Get authenticated user
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) {
      return {
        success: false,
        error: locale === "fr" ? "Non authentifié" : "Not authenticated",
      };
    }

    await connectDB();

    // Get user and course
    const [user, course] = await Promise.all([
      User.findById(tokenPayload.userId),
      Course.findById(courseId).populate("modules"),
    ]);

    if (!user) {
      return {
        success: false,
        error: locale === "fr" ? "Utilisateur introuvable" : "User not found",
      };
    }

    if (!course) {
      return {
        success: false,
        error: locale === "fr" ? "Cours introuvable" : "Course not found",
      };
    }

    // Check if course is free
    if (course.isFree) {
      return {
        success: false,
        error: locale === "fr" ? "Ce cours est gratuit" : "This course is free",
      };
    }

    // Check if already purchased
    const objectIdCourseId = new mongoose.Types.ObjectId(courseId);
    if (user.purchasedCourses.some((id) => id.equals(objectIdCourseId))) {
      return {
        success: false,
        error:
          locale === "fr" ? "Cours déjà acheté" : "Course already purchased",
      };
    }

    // Validate phone number format
    if (!/^6[\d]{8}$/.test(phone)) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Numéro de téléphone invalide. Format attendu: 6XXXXXXXX"
            : "Invalid phone number. Expected format: 6XXXXXXXX",
      };
    }

    // Generate unique external ID
    const externalId = `COURSE_${courseId}_${Date.now()}_${crypto
      .randomBytes(4)
      .toString("hex")}`;

    // Initiate payment with Fapshi
    const fapshiResponse = await fapshiClient.directPay({
      amount: course.price || 0,
      phone,
      medium,
      name: user.name,
      email: user.email,
      userId: (user._id as mongoose.Types.ObjectId).toString(),
      externalId,
      message: `Course Purchase: ${course.title}`,
    });

    console.log("Fapshi response:", fapshiResponse);

    if (!fapshiResponse.success) {
      return {
        success: false,
        error:
          fapshiResponse.message ||
          (locale === "fr"
            ? "Échec de l'initiation du paiement"
            : "Payment initiation failed"),
      };
    }

    // Save payment record
    const payment = await Payment.create({
      userId: user._id,
      courseId: objectIdCourseId,
      amount: course.price,
      currency: course.currency || "XAF",
      transactionId: fapshiResponse.transId,
      externalId,
      phone,
      email: user.email,
      status: "pending",
      medium,
      initiatedAt: new Date(),
    });

    return {
      success: true,
      message:
        locale === "fr"
          ? "Paiement initié. Veuillez vérifier votre téléphone."
          : "Payment initiated. Please check your phone.",
      data: {
        transactionId: payment.transactionId,
        externalId: payment.externalId,
        amount: payment.amount,
        status: payment.status,
        courseName: course.title,
        moduleCount: course.modules.length,
      },
    };
  } catch (error) {
    console.error("Initiate payment error:", error);
    return {
      success: false,
      error:
        locale === "fr"
          ? "Erreur lors de l'initiation du paiement"
          : "Payment initiation error",
    };
  }
}

/**
 * Check payment status and update records
 */
export async function checkPaymentStatus(transactionId: string) {
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

    // Get payment record
    const payment = await Payment.findOne({ transactionId }).populate(
      "courseId"
    );

    if (!payment) {
      return {
        success: false,
        error:
          locale === "fr" ? "Transaction introuvable" : "Transaction not found",
      };
    }

    // Check if already processed
    if (payment.status === "successful") {
      return {
        success: true,
        message:
          locale === "fr"
            ? "Paiement déjà traité"
            : "Payment already processed",
        data: {
          status: payment.status,
          completedAt: payment.completedAt,
        },
      };
    }

    // Check status with Fapshi
    const fapshiResponse = await fapshiClient.getPaymentStatus(transactionId);

    console.log("RESFAP", fapshiResponse);

    if (!fapshiResponse.success) {
      return {
        success: false,
        error:
          fapshiResponse.message ||
          (locale === "fr"
            ? "Impossible de vérifier le statut"
            : "Unable to check status"),
      };
    }

    const fapshiStatus = fapshiResponse.status;

    // Update payment status
    payment.status = fapshiStatus;

    if (fapshiStatus === "successful") {
      payment.completedAt = new Date();

      // Add course to user's purchased courses
      const user = await User.findById(payment.userId);
      if (
        user &&
        !user.purchasedCourses.some((id) => id.equals(payment.courseId))
      ) {
        user.purchasedCourses.push(payment.courseId);
        await user.save();
      }

      // Increment course enrollment count
      const course = await Course.findById(payment.courseId);
      if (course) {
        course.enrolledCount = (course.enrolledCount || 0) + 1;
        await course.save();
      }

      await payment.save();

      return {
        success: true,
        message:
          locale === "fr"
            ? "Paiement confirmé! Vous pouvez maintenant accéder au cours et tous ses modules."
            : "Payment confirmed! You can now access the course and all its modules.",
        data: {
          status: "successful",
          completedAt: payment.completedAt,
        },
      };
    } else if (fapshiStatus === "failed") {
      payment.failureReason = fapshiResponse?.message || "Payment failed";
      await payment.save();

      return {
        success: false,
        error: locale === "fr" ? "Le paiement a échoué" : "Payment failed",
        data: {
          status: "failed",
          reason: payment.failureReason,
        },
      };
    } else if (fapshiStatus === "expired") {
      await payment.save();

      return {
        success: false,
        error:
          locale === "fr" ? "La transaction a expiré" : "Transaction expired",
        data: {
          status: "expired",
        },
      };
    }

    // Still pending
    await payment.save();

    return {
      success: true,
      message:
        locale === "fr" ? "Paiement en attente..." : "Payment pending...",
      data: {
        status: "pending",
      },
    };
  } catch (error) {
    console.error("Check payment status error:", error);
    return {
      success: false,
      error:
        locale === "fr"
          ? "Erreur lors de la vérification du statut"
          : "Status check error",
    };
  }
}

/**
 * Get user's payment history
 */
export async function getUserPayments() {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return [];

    await connectDB();

    const payments = await Payment.find({
      userId: tokenPayload.userId,
    })
      .populate("courseId")
      .sort({ initiatedAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(payments));
  } catch (error) {
    console.error("Get user payments error:", error);
    return [];
  }
}

/**
 * Get payment by transaction ID
 */
export async function getPaymentByTransactionId(transactionId: string) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return null;

    await connectDB();

    const payment = await Payment.findOne({
      transactionId,
      userId: tokenPayload.userId,
    })
      .populate("courseId")
      .lean();

    return payment ? JSON.parse(JSON.stringify(payment)) : null;
  } catch (error) {
    console.error("Get payment error:", error);
    return null;
  }
}

/**
 * Get payment statistics for user
 */
export async function getUserPaymentStats() {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return null;

    await connectDB();

    const payments = await Payment.find({
      userId: tokenPayload.userId,
    }).lean();

    const stats = {
      totalSpent: 0,
      successfulPayments: 0,
      pendingPayments: 0,
      failedPayments: 0,
      coursesPurchased: 0,
    };

    payments.forEach((payment) => {
      if (payment.status === "successful") {
        stats.totalSpent += payment.amount;
        stats.successfulPayments++;
        stats.coursesPurchased++;
      } else if (payment.status === "pending") {
        stats.pendingPayments++;
      } else if (payment.status === "failed") {
        stats.failedPayments++;
      }
    });

    return stats;
  } catch (error) {
    console.error("Get payment stats error:", error);
    return null;
  }
}
