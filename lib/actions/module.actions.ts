"use server";

import { connectDB } from "@/lib/db";
import { getLocale } from "next-intl/server";

// Helper to safely extract an id string from a populated field or ObjectId
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractId(field: any): string | undefined {
  if (!field) return undefined;
  if (typeof field === "string") return field;
  if (field._id) return field._id.toString();
  if (typeof field.toString === "function") return field.toString();
  return undefined;
}

/**
 * Get all modules (across all courses)
 */
export async function getAllModules() {
  try {
    const sql = await connectDB();
    const locale = await getLocale();

    const modules = await sql`
      SELECT
        m.id,
        m.course_id,
        m.title,
        m.title_fr,
        m.description,
        m.description_fr,
        m.slug,
        m.image_url,
        m.duration,
        m.level,
        m."order",
        COALESCE(jsonb_array_length(m.lessons), 0)::int AS lesson_count
      FROM modules m
      WHERE m.is_published = TRUE
      ORDER BY m."order" ASC
    `;

    // Transform data based on locale
    return modules.map((courseModule) => ({
      _id: courseModule.id,
      courseId: courseModule.course_id,
      title: locale === "fr" ? courseModule.title_fr : courseModule.title,
      description:
        locale === "fr" ? courseModule.description_fr : courseModule.description,
      slug: courseModule.slug,
      imageUrl: courseModule.image_url,
      duration: courseModule.duration,
      level: courseModule.level,
      order: courseModule.order,
      lessonCount: Number(courseModule.lesson_count ?? 0),
    }));
  } catch (error) {
    console.error("Error fetching modules:", error);
    return [];
  }
}

/**
 * Get module by slug with course information
 */
export async function getModuleBySlug(slug: string) {
  try {
    const sql = await connectDB();
    const locale = await getLocale();

    const [courseModule] = await sql`
      SELECT
        m.id,
        m.course_id,
        m.title,
        m.title_fr,
        m.description,
        m.description_fr,
        m.content,
        m.content_fr,
        m.objectives,
        m.objectives_fr,
        m.slug,
        m.image_url,
        m.duration,
        m.level,
        m."order",
        m.lessons,
        c.title AS course_title,
        c.title_fr AS course_title_fr,
        c.slug AS course_slug,
        c.is_free AS course_is_free,
        c.price AS course_price
      FROM modules m
      JOIN courses c ON c.id = m.course_id
      WHERE m.slug = ${slug} AND m.is_published = TRUE
      LIMIT 1
    `;

    if (!courseModule) {
      return null;
    }

    return {
      _id: courseModule.id,
      courseId: courseModule.course_id,
      courseName: locale === "fr" ? courseModule.course_title_fr : courseModule.course_title,
      courseSlug: courseModule.course_slug,
      isFree: Boolean(courseModule.course_is_free),
      coursePrice: Number(courseModule.course_price ?? 0),
      title: locale === "fr" ? courseModule.title_fr : courseModule.title,
      description:
        locale === "fr" ? courseModule.description_fr : courseModule.description,
      content: locale === "fr" ? courseModule.content_fr : courseModule.content,
      objectives:
        locale === "fr" ? courseModule.objectives_fr : courseModule.objectives,
      slug: courseModule.slug,
      imageUrl: courseModule.image_url,
      duration: courseModule.duration,
      level: courseModule.level,
      order: courseModule.order,
      lessons: courseModule.lessons ?? [],
    };
  } catch (error) {
    console.error("Error fetching module:", error);
    return null;
  }
}

/**
 * Get modules by course ID
 */
export async function getModulesByCourse(courseId: string) {
  try {
    const sql = await connectDB();
    const locale = await getLocale();

    const modules = await sql`
      SELECT id, title, title_fr, description, description_fr, slug, image_url, duration, level, "order",
             COALESCE(jsonb_array_length(lessons), 0)::int AS lesson_count
      FROM modules
      WHERE course_id = ${courseId} AND is_published = TRUE
      ORDER BY "order" ASC
    `;

    return modules.map((courseModule) => ({
      _id: courseModule.id,
      title: locale === "fr" ? courseModule.title_fr : courseModule.title,
      description:
        locale === "fr" ? courseModule.description_fr : courseModule.description,
      slug: courseModule.slug,
      imageUrl: courseModule.image_url,
      duration: courseModule.duration,
      level: courseModule.level,
      order: courseModule.order,
      lessonCount: Number(courseModule.lesson_count ?? 0),
    }));
  } catch (error) {
    console.error("Error fetching modules by course:", error);
    return [];
  }
}

/**
 * Get featured modules (from featured courses)
 */
export async function getFeaturedModules(limit: number = 6) {
  try {
    const sql = await connectDB();
    const locale = await getLocale();

    const featuredCourses = await sql`
      SELECT id FROM courses WHERE is_published = TRUE ORDER BY "order" ASC LIMIT 3
    `;

    if (!featuredCourses.length) return [];

    const courseIds = featuredCourses.map((c) => c.id);

    const modules = await sql`
      SELECT
        m.id,
        m.course_id,
        m.title,
        m.title_fr,
        m.description,
        m.description_fr,
        m.slug,
        m.image_url,
        m.duration,
        m.level,
        COALESCE(jsonb_array_length(m.lessons), 0)::int AS lesson_count
      FROM modules m
      WHERE m.course_id = ANY(${courseIds}) AND m.is_published = TRUE
      ORDER BY m."order" ASC
      LIMIT ${limit}
    `;

    return modules.map((courseModule) => ({
      _id: courseModule.id,
      courseId: courseModule.course_id,
      title: locale === "fr" ? courseModule.title_fr : courseModule.title,
      description:
        locale === "fr" ? courseModule.description_fr : courseModule.description,
      slug: courseModule.slug,
      imageUrl: courseModule.image_url,
      duration: courseModule.duration,
      level: courseModule.level,
      lessonCount: Number(courseModule.lesson_count ?? 0),
    }));
  } catch (error) {
    console.error("Error fetching featured modules:", error);
    return [];
  }
}

/**
 * Get module with lessons by ID
 */
export async function getModuleById(moduleId: string) {
  try {
    const sql = await connectDB();
    const locale = await getLocale();

    const [courseModule] = await sql`
      SELECT
        m.id,
        m.course_id,
        m.title,
        m.title_fr,
        m.description,
        m.description_fr,
        m.content,
        m.content_fr,
        m.objectives,
        m.objectives_fr,
        m.slug,
        m.image_url,
        m.duration,
        m.level,
        m.lessons,
        c.title AS course_title,
        c.title_fr AS course_title_fr,
        c.is_free AS course_is_free
      FROM modules m
      JOIN courses c ON c.id = m.course_id
      WHERE m.id = ${moduleId}
      LIMIT 1
    `;

    if (!courseModule) {
      return null;
    }

    return {
      _id: courseModule.id,
      courseId: courseModule.course_id,
      courseName: locale === "fr" ? courseModule.course_title_fr : courseModule.course_title,
      isFree: Boolean(courseModule.course_is_free),
      title: locale === "fr" ? courseModule.title_fr : courseModule.title,
      description:
        locale === "fr" ? courseModule.description_fr : courseModule.description,
      content: locale === "fr" ? courseModule.content_fr : courseModule.content,
      objectives:
        locale === "fr" ? courseModule.objectives_fr : courseModule.objectives,
      slug: courseModule.slug,
      imageUrl: courseModule.image_url,
      duration: courseModule.duration,
      level: courseModule.level,
      lessons: Array.isArray(courseModule.lessons) ? courseModule.lessons.map((lesson: any) => ({
        _id: lesson._id ?? null,
        title: locale === "fr" ? lesson.titleFr || lesson.title : lesson.title,
        description:
          locale === "fr" ? lesson.descriptionFr || lesson.description : lesson.description,
        type: lesson.type,
        content:
          locale === "fr" ? lesson.contentFr || lesson.content : lesson.content,
        duration: lesson.duration,
        order: lesson.order,
        isPreview: lesson.isPreview,
        hasQuiz: lesson.hasQuiz,
      })) : [],
    };
  } catch (error) {
    console.error("Error fetching module by ID:", error);
    return null;
  }
}

/**
 * Get next module in course
 */
export async function getNextModule(currentModuleId: string) {
  try {
    const sql = await connectDB();
    const locale = await getLocale();

    const [currentModule] = await sql`
      SELECT course_id, "order" FROM modules WHERE id = ${currentModuleId} LIMIT 1
    `;
    if (!currentModule) return null;

    const [nextModule] = await sql`
      SELECT id, title, title_fr, slug, "order"
      FROM modules
      WHERE course_id = ${currentModule.course_id}
        AND "order" > ${currentModule.order}
        AND is_published = TRUE
      ORDER BY "order" ASC
      LIMIT 1
    `;

    if (!nextModule) return null;

    return {
      _id: nextModule.id,
      title: locale === "fr" ? nextModule.title_fr : nextModule.title,
      slug: nextModule.slug,
      order: nextModule.order,
    };
  } catch (error) {
    console.error("Error fetching next module:", error);
    return null;
  }
}

/**
 * Get previous module in course
 */
export async function getPreviousModule(currentModuleId: string) {
  try {
    const sql = await connectDB();
    const locale = await getLocale();

    const [currentModule] = await sql`
      SELECT course_id, "order" FROM modules WHERE id = ${currentModuleId} LIMIT 1
    `;
    if (!currentModule) return null;

    const [previousModule] = await sql`
      SELECT id, title, title_fr, slug, "order"
      FROM modules
      WHERE course_id = ${currentModule.course_id}
        AND "order" < ${currentModule.order}
        AND is_published = TRUE
      ORDER BY "order" DESC
      LIMIT 1
    `;

    if (!previousModule) return null;

    return {
      _id: previousModule.id,
      title: locale === "fr" ? previousModule.title_fr : previousModule.title,
      slug: previousModule.slug,
      order: previousModule.order,
    };
  } catch (error) {
    console.error("Error fetching previous module:", error);
    return null;
  }
}
