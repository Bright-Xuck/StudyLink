"use server";

import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Course, { ICourse } from "@/lib/models/Course";
import Module from "@/lib/models/Module";
import { getCurrentUser } from "@/lib/utils/jwt";
import mongoose from "mongoose";
import { getLocale } from "next-intl/server";

/**
 * Enroll in a free course
 */
export async function enrollFreeCourse(courseId: string) {
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

    // Check if course exists and is free
    const course = await Course.findById(courseId);

    if (!course) {
      return {
        success: false,
        error: locale === "fr" ? "Cours introuvable" : "Course not found",
      };
    }

    if (!course.isFree) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Ce cours nécessite un paiement"
            : "This course requires payment",
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
    const objectIdCourseId = new mongoose.Types.ObjectId(courseId);
    if (user.purchasedCourses.some((id) => id.equals(objectIdCourseId))) {
      return {
        success: true,
        message:
          locale === "fr"
            ? "Déjà inscrit à ce cours"
            : "Already enrolled in this course",
      };
    }

    // Add course to user's purchased courses
    user.purchasedCourses.push(objectIdCourseId);
    await user.save();

    // Increment enrolled count
    course.enrolledCount = (course.enrolledCount || 0) + 1;
    await course.save();

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

/**
 * Check if user has access to a course (and all its modules)
 */
export async function checkCourseAccess(courseId: string): Promise<boolean> {
  try {
    const tokenPayload = await getCurrentUser();

    if (!tokenPayload) {
      return false;
    }

    await connectDB();

    // Check if course is free
    const course = await Course.findById(courseId);
    if (course?.isFree) {
      return true;
    }

    // Check if user purchased the course
    const user = await User.findById(tokenPayload.userId);

    if (!user) {
      return false;
    }

    const objectIdCourseId = new mongoose.Types.ObjectId(courseId);
    return user.purchasedCourses.some((id) => id.equals(objectIdCourseId));
  } catch (error) {
    console.error("Check access error:", error);
    return false;
  }
}

/**
 * Check if user has access to a module (via its parent course)
 */
export async function checkModuleAccess(moduleId: string): Promise<boolean> {
  try {
    const tokenPayload = await getCurrentUser();

    if (!tokenPayload) {
      return false;
    }

    await connectDB();

    // Get module to find parent course
    const courseModule = await Module.findById(moduleId);
    if (!courseModule) {
      return false;
    }

    // Check course access
    return await checkCourseAccess(courseModule.courseId.toString());
  } catch (error) {
    console.error("Check module access error:", error);
    return false;
  }
}

/**
 * Get user's enrolled courses
 */
export async function getUserEnrolledCourses() {
  try {
    const locale = await getLocale();
    const tokenPayload = await getCurrentUser();

    if (!tokenPayload) {
      return [];
    }

    await connectDB();

    const user = await User.findById(tokenPayload.userId).populate({
      path: "purchasedCourses",
      populate: {
        path: "modules",
        model: "Module",
      },
    });

    if (!user) {
      return [];
    }

    // Transform courses based on locale
    return (user.purchasedCourses as unknown as ICourse[]).map(
      (course: ICourse) => ({
        _id: course._id.toString(),
        title: locale === "fr" ? course.titleFr : course.title,
        description:
          locale === "fr" ? course.descriptionFr : course.description,
        slug: course.slug,
        imageUrl: course.imageUrl,
        department: course.department,
        faculty: course.faculty,
        isFree: course.isFree,
        price: course.price,
        duration: course.duration,
        level: course.level,
        moduleCount: course.modules.length,
      })
    );
  } catch (error) {
    console.error("Get enrolled courses error:", error);
    return [];
  }
}

interface IModuleData {
  _id: mongoose.Types.ObjectId | string;
  titleFr?: string;
  title: string;
  descriptionFr?: string;
  description: string;
  slug: string;
  imageUrl: string;
  duration: string;
  level: string;
  lessons?: unknown[];
}

interface EnrolledModule {
  _id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  slug: string;
  imageUrl: string;
  duration: string;
  level: string;
  lessonCount: number;
}

/**
 * Get user's enrolled modules (across all courses)
 */
export async function getUserEnrolledModules() {
  try {
    const locale = await getLocale();
    const tokenPayload = await getCurrentUser();

    if (!tokenPayload) {
      return [];
    }

    await connectDB();

    const user = await User.findById(tokenPayload.userId).populate({
      path: "purchasedCourses",
      populate: {
        path: "modules",
        model: "Module",
      },
    });

    if (!user) {
      return [];
    }

    // Flatten all modules from all enrolled courses
    const allModules: EnrolledModule[] = [];

    for (const course of user.purchasedCourses as unknown as ICourse[]) {
      if (course.modules && Array.isArray(course.modules)) {
        for (const courseModule of course.modules as unknown as IModuleData[]) {
          allModules.push({
            _id: courseModule._id.toString(),
            courseId: course._id.toString(),
            courseTitle: locale === "fr" ? course.titleFr : course.title,
            title:
              locale === "fr"
                ? courseModule.titleFr || courseModule.title
                : courseModule.title,
            description:
              locale === "fr"
                ? courseModule.descriptionFr || courseModule.description
                : courseModule.description,
            slug: courseModule.slug,
            imageUrl: courseModule.imageUrl,
            duration: courseModule.duration,
            level: courseModule.level,
            lessonCount: courseModule.lessons?.length || 0,
          });
        }
      }
    }

    return allModules;
  } catch (error) {
    console.error("Get enrolled modules error:", error);
    return [];
  }
}

/**
 * Get course enrollment status for a user
 */
export async function getCourseEnrollmentStatus(courseId: string) {
  try {
    const tokenPayload = await getCurrentUser();

    if (!tokenPayload) {
      return {
        isEnrolled: false,
        canEnroll: false,
        reason: "not_authenticated",
      };
    }

    await connectDB();

    const course = await Course.findById(courseId);
    if (!course) {
      return {
        isEnrolled: false,
        canEnroll: false,
        reason: "course_not_found",
      };
    }

    // Check if already enrolled
    const hasAccess = await checkCourseAccess(courseId);

    if (hasAccess) {
      return {
        isEnrolled: true,
        canEnroll: false,
        reason: "already_enrolled",
      };
    }

    // Can enroll if not already enrolled
    return {
      isEnrolled: false,
      canEnroll: true,
      reason: course.isFree ? "free_course" : "paid_course",
      price: course.price,
      isFree: course.isFree,
    };
  } catch (error) {
    console.error("Get enrollment status error:", error);
    return {
      isEnrolled: false,
      canEnroll: false,
      reason: "error",
    };
  }
}
