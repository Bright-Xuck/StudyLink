"use server";

import { connectDB } from "@/lib/db";
import Payment from "@/lib/models/Payment";
import User from "@/lib/models/User";
import Module from "@/lib/models/Module";
import { getCurrentUser } from "@/lib/utils/jwt";
import { fapshiClient } from "@/lib/utils/fapshi";
import { getLocale } from "next-intl/server";
import mongoose from "mongoose";
import crypto from "crypto";

/**
 * Initiate a direct payment for a module
 */
export async function initiateModulePayment(
  moduleId: string,
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

    // Get user and module
    const [user, courseModule] = await Promise.all([
      User.findById(tokenPayload.userId),
      Module.findById(moduleId),
    ]);

    if (!user) {
      return {
        success: false,
        error: locale === "fr" ? "Utilisateur introuvable" : "User not found",
      };
    }

    if (!courseModule) {
      return {
        success: false,
        error: locale === "fr" ? "Module introuvable" : "Module not found",
      };
    }

    // Check if module is free
    if (courseModule.isFree) {
      return {
        success: false,
        error:
          locale === "fr" ? "Ce module est gratuit" : "This module is free",
      };
    }

    // Check if already purchased
    const objectIdModuleId = new mongoose.Types.ObjectId(moduleId);
    if (user.purchasedModules.some((id) => id.equals(objectIdModuleId))) {
      return {
        success: false,
        error:
          locale === "fr" ? "Module déjà acheté" : "Module already purchased",
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
    const externalId = `MODULE_${moduleId}_${Date.now()}_${crypto
      .randomBytes(4)
      .toString("hex")}`;

    // Initiate payment with Fapshi
    const fapshiResponse = await fapshiClient.directPay({
      amount: courseModule.price || 0,
      phone,
      medium,
      name: user.name,
      email: user.email,
      userId: (user._id as mongoose.Types.ObjectId).toString(),
      externalId,
      message: `Purchase: ${courseModule.title}`,
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
      moduleId: objectIdModuleId,
      amount: courseModule.price,
      currency: "XAF",
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
    const payment = await Payment.findOne({ transactionId });

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

    console.log("RESFAP", fapshiResponse)

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

      // Add module to user's purchased modules
      const user = await User.findById(payment.userId);
      if (
        user &&
        !user.purchasedModules.some((id) => id.equals(payment.moduleId))
      ) {
        user.purchasedModules.push(payment.moduleId);
        await user.save();
      }

      await payment.save();

      return {
        success: true,
        message:
          locale === "fr"
            ? "Paiement confirmé! Vous pouvez maintenant accéder au module."
            : "Payment confirmed! You can now access the module.",
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
      .populate("moduleId")
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
      .populate("moduleId")
      .lean();

    return payment ? JSON.parse(JSON.stringify(payment)) : null;
  } catch (error) {
    console.error("Get payment error:", error);
    return null;
  }
}
