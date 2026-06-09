"use server";

import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/utils/jwt";
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

    const sql = await connectDB();

    const [course] = await sql`SELECT id, is_free, enrolled_count FROM courses WHERE id = ${courseId} LIMIT 1`;

    if (!course) {
      return {
        success: false,
        error: locale === "fr" ? "Cours introuvable" : "Course not found",
      };
    }

    if (!course.is_free) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Ce cours nécessite un paiement"
            : "This course requires payment",
      };
    }

    const [user] = await sql`SELECT id, purchased_courses FROM users WHERE id = ${tokenPayload.userId} LIMIT 1`;

    if (!user) {
      return {
        success: false,
        error: locale === "fr" ? "Utilisateur introuvable" : "User not found",
      };
    }

    // Check if already enrolled
    if ((user.purchased_courses || []).includes(courseId)) {
      return {
        success: true,
        message:
          locale === "fr"
            ? "Déjà inscrit à ce cours"
            : "Already enrolled in this course",
      };
    }

    // Add course to user's purchased courses
    await sql`
      UPDATE users
      SET purchased_courses = array_append(COALESCE(purchased_courses, '{}'::uuid[]), ${courseId}::uuid)
      WHERE id = ${user.id}
    `;

    await sql`
      UPDATE courses
      SET enrolled_count = COALESCE(enrolled_count, 0) + 1
      WHERE id = ${course.id}
    `;

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

    const sql = await connectDB();

    const [user] = await sql`SELECT purchased_courses FROM users WHERE id = ${tokenPayload.userId} LIMIT 1`;

    if (!user) {
      return false;
    }

    return (user?.purchased_courses || []).includes(courseId);
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

    const sql = await connectDB();

    const [courseModule] = await sql`SELECT course_id FROM modules WHERE id = ${moduleId} LIMIT 1`;
    if (!courseModule) {
      return false;
    }

    // Check course access
    return await checkCourseAccess(courseModule.course_id);
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

    const sql = await connectDB();

    const [user] = await sql`SELECT purchased_courses FROM users WHERE id = ${tokenPayload.userId} LIMIT 1`;

    if (!user) {
      return [];
    }

    // Transform courses based on locale
    const purchasedIds = (user?.purchased_courses || []).map((id: string) => String(id));
    if (!purchasedIds.length) return [];

    const courses = await sql`
      SELECT id, title, title_fr, description, description_fr, slug, image_url, department, faculty, is_free, price, duration, level,
             (SELECT COUNT(*) FROM modules WHERE modules.course_id = courses.id AND modules.is_published = TRUE)::int AS module_count
      FROM courses
      WHERE id = ANY(${purchasedIds}) AND is_published = TRUE
    `;

    return courses.map((course) => ({
      _id: course.id,
      title: locale === "fr" ? course.title_fr : course.title,
      description: locale === "fr" ? course.description_fr : course.description,
      slug: course.slug,
      imageUrl: course.image_url,
      department: course.department ?? "",
      faculty: course.faculty ?? "",
      isFree: Boolean(course.is_free),
      price: Number(course.price ?? 0),
      duration: course.duration ?? "",
      level: course.level ?? "beginner",
      moduleCount: Number(course.module_count ?? 0),
    }));
  } catch (error) {
    console.error("Get enrolled courses error:", error);
    return [];
  }
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

    const sql = await connectDB();

    const [user] = await sql`SELECT purchased_courses FROM users WHERE id = ${tokenPayload.userId} LIMIT 1`;

    if (!user) {
      return [];
    }

    const purchasedIds = (user?.purchased_courses || []).map((id: string) => String(id));
    if (!purchasedIds.length) return [];

    const modules = await sql`
      SELECT
        m.id,
        m.course_id,
        c.title,
        c.title_fr,
        m.title AS module_title,
        m.title_fr AS module_title_fr,
        m.description,
        m.description_fr,
        m.slug,
        m.image_url,
        m.duration,
        m.level,
        COALESCE(jsonb_array_length(m.lessons), 0)::int AS lesson_count
      FROM modules m
      JOIN courses c ON c.id = m.course_id
      WHERE m.course_id = ANY(${purchasedIds}) AND m.is_published = TRUE
      ORDER BY m."order" ASC
    `;

    return modules.map((courseModule) => ({
      _id: courseModule.id,
      courseId: courseModule.course_id,
      courseTitle: locale === "fr" ? courseModule.title_fr : courseModule.title,
      title: locale === "fr" ? courseModule.module_title_fr : courseModule.module_title,
      description: locale === "fr" ? courseModule.description_fr : courseModule.description,
      slug: courseModule.slug,
      imageUrl: courseModule.image_url,
      duration: courseModule.duration,
      level: courseModule.level,
      lessonCount: Number(courseModule.lesson_count ?? 0),
    }));
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

    const sql = await connectDB();

    const [course] = await sql`SELECT id, is_free, price FROM courses WHERE id = ${courseId} LIMIT 1`;
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
      price: Number(course.price ?? 0),
      isFree: Boolean(course.is_free),
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
