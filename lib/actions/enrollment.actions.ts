"use server";

import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Module, { IModule } from "@/lib/models/Module";
import { getCurrentUser } from "@/lib/utils/jwt";
import mongoose from "mongoose";
import { getLocale } from "next-intl/server";

export async function enrollFreeModule(moduleId: string) {
  const locale = await getLocale();
  try {
    // Get current user
    const tokenPayload = await getCurrentUser();

    if (!tokenPayload) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Vous devez être connecté pour vous inscrire"
            : "You must be logged in to enroll",
      };
    }

    await connectDB();

    // Check if module exists and is free
    const courseModule = await Module.findById(moduleId); // Renamed `module` to `courseModule`

    if (!courseModule) {
      return {
        success: false,
        error: locale === "fr" ? "Module introuvable" : "Module not found",
      };
    }

    if (!courseModule.isFree) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Ce module nécessite un paiement"
            : "This module requires payment",
      };
    }

    // Get user
    const user = await User.findById(tokenPayload.userId);

    if (!user) {
      return {
        success: false,
        error: locale === "fr" ? "Utilisateur introuvable" : "User not found",
      };
    }

    // Check if already enrolled
    const objectIdModuleId = new mongoose.Types.ObjectId(moduleId);
    if (user.purchasedModules.some((id) => id.equals(objectIdModuleId))) {
      return {
        success: true,
        message:
          locale === "fr"
            ? "Déjà inscrit à ce module"
            : "Already enrolled in this module",
      };
    }

    // Add module to user's purchased modules
    user.purchasedModules.push(objectIdModuleId);
    await user.save();

    return {
      success: true,
      message:
        locale === "fr" ? "Inscription réussie!" : "Enrollment successful!",
    };
  } catch (error) {
    console.error("Enrollment error:", error);
    return {
      success: false,
      error: locale === "fr" ? "Une erreur est survenue" : "An error occurred",
    };
  }
}

export async function checkModuleAccess(moduleId: string): Promise<boolean> {
  try {
    const tokenPayload = await getCurrentUser();

    if (!tokenPayload) {
      return false;
    }

    await connectDB();

    // Check if module is free
    const courseModule = await Module.findById(moduleId); // Renamed `module` to `courseModule`
    if (courseModule?.isFree) {
      return true;
    }

    // Check if user purchased the module
    const user = await User.findById(tokenPayload.userId);

    if (!user) {
      return false;
    }

    const objectIdModuleId = new mongoose.Types.ObjectId(moduleId);
    return user.purchasedModules.some((id) => id.equals(objectIdModuleId));
  } catch (error) {
    console.error("Check access error:", error);
    return false;
  }
}

export async function getUserEnrolledModules() {
  try {
    const locale = await getLocale();
    const tokenPayload = await getCurrentUser();

    if (!tokenPayload) {
      return [];
    }

    await connectDB();

    const user = await User.findById(tokenPayload.userId).populate(
      "purchasedModules"
    );

    if (!user) {
      return [];
    }

    // Transform modules based on locale
    return (user.purchasedModules as unknown as IModule[]).map(
      (courseModule: IModule) => ({
        _id: courseModule._id.toString(),
        title: locale === "fr" ? courseModule.titleFr : courseModule.title,
        description:
          locale === "fr"
            ? courseModule.descriptionFr
            : courseModule.description,
        slug: courseModule.slug,
        imageUrl: courseModule.imageUrl,
        isFree: courseModule.isFree,
        price: courseModule.price,
        duration: courseModule.duration,
        level: courseModule.level,
      })
    );
  } catch (error) {
    console.error("Get enrolled modules error:", error);
    return [];
  }
}
