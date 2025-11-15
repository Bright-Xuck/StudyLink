"use server";

import { connectDB } from "@/lib/db";
import Module from "@/lib/models/Module";
import Course from "@/lib/models/Course";
import { getLocale } from "next-intl/server";

// Helper to safely extract an id string from a populated field or ObjectId
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
    await connectDB();
    const locale = await getLocale();

    const modules = await Module.find({ isPublished: true })
      .populate("courseId")
      .sort({ order: 1 })
      .lean();

    // Transform data based on locale
    return modules.map((courseModule) => ({
      _id: courseModule._id.toString(),
      courseId: extractId(courseModule.courseId),
      title: locale === "fr" ? courseModule.titleFr : courseModule.title,
      description:
        locale === "fr" ? courseModule.descriptionFr : courseModule.description,
      slug: courseModule.slug,
      imageUrl: courseModule.imageUrl,
      duration: courseModule.duration,
      level: courseModule.level,
      order: courseModule.order,
      lessonCount: courseModule.lessons?.length || 0,
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
    await connectDB();
    const locale = await getLocale();

    const courseModule = await Module.findOne({ slug, isPublished: true })
      .populate("courseId")
      .lean();

    if (!courseModule) {
      return null;
    }

  // Get course info (use extracted id when populated)
  const course = await Course.findById(extractId(courseModule.courseId)).lean();

    return {
      _id: courseModule._id.toString(),
      courseId: extractId(courseModule.courseId),
      courseName: course
        ? locale === "fr"
          ? course.titleFr
          : course.title
        : "",
      courseSlug: course?.slug,
      isFree: course?.isFree || false,
      coursePrice: course?.price || 0,
      title: locale === "fr" ? courseModule.titleFr : courseModule.title,
      description:
        locale === "fr" ? courseModule.descriptionFr : courseModule.description,
      content: locale === "fr" ? courseModule.contentFr : courseModule.content,
      objectives:
        locale === "fr" ? courseModule.objectivesFr : courseModule.objectives,
      slug: courseModule.slug,
      imageUrl: courseModule.imageUrl,
      duration: courseModule.duration,
      level: courseModule.level,
      order: courseModule.order,
      lessons: courseModule.lessons,
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
    await connectDB();
    const locale = await getLocale();

    const modules = await Module.find({
      courseId,
      isPublished: true,
    })
      .sort({ order: 1 })
      .lean();

    return modules.map((courseModule) => ({
      _id: courseModule._id.toString(),
      title: locale === "fr" ? courseModule.titleFr : courseModule.title,
      description:
        locale === "fr" ? courseModule.descriptionFr : courseModule.description,
      slug: courseModule.slug,
      imageUrl: courseModule.imageUrl,
      duration: courseModule.duration,
      level: courseModule.level,
      order: courseModule.order,
      lessonCount: courseModule.lessons?.length || 0,
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
    await connectDB();
    const locale = await getLocale();

    // Get featured courses first
    const featuredCourses = await Course.find({
      isPublished: true,
    })
      .sort({ order: 1 })
      .limit(3)
      .lean();

    if (!featuredCourses.length) return [];

    const courseIds = featuredCourses.map((c) => c._id);

    // Get modules from featured courses
    const modules = await Module.find({
      courseId: { $in: courseIds },
      isPublished: true,
    })
      .populate("courseId")
      .sort({ order: 1 })
      .limit(limit)
      .lean();

    return modules.map((courseModule) => ({
      _id: courseModule._id.toString(),
      courseId: extractId(courseModule.courseId),
      title: locale === "fr" ? courseModule.titleFr : courseModule.title,
      description:
        locale === "fr" ? courseModule.descriptionFr : courseModule.description,
      slug: courseModule.slug,
      imageUrl: courseModule.imageUrl,
      duration: courseModule.duration,
      level: courseModule.level,
      lessonCount: courseModule.lessons?.length || 0,
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
    await connectDB();
    const locale = await getLocale();

    const courseModule = await Module.findById(moduleId)
      .populate("courseId")
      .lean();

    if (!courseModule) {
      return null;
    }

  const course = await Course.findById(extractId(courseModule.courseId)).lean();

    return {
      _id: courseModule._id.toString(),
      courseId: extractId(courseModule.courseId),
      courseName: course
        ? locale === "fr"
          ? course.titleFr
          : course.title
        : "",
      isFree: course?.isFree || false,
      title: locale === "fr" ? courseModule.titleFr : courseModule.title,
      description:
        locale === "fr" ? courseModule.descriptionFr : courseModule.description,
      content: locale === "fr" ? courseModule.contentFr : courseModule.content,
      objectives:
        locale === "fr" ? courseModule.objectivesFr : courseModule.objectives,
      slug: courseModule.slug,
      imageUrl: courseModule.imageUrl,
      duration: courseModule.duration,
      level: courseModule.level,
      lessons: courseModule.lessons.map((lesson) => ({
        _id: lesson._id?.toString(),
        title: locale === "fr" ? lesson.titleFr : lesson.title,
        description:
          locale === "fr" ? lesson.descriptionFr : lesson.description,
        type: lesson.type,
        content:
          locale === "fr" ? lesson.contentFr || lesson.content : lesson.content,
        duration: lesson.duration,
        order: lesson.order,
        isPreview: lesson.isPreview,
        hasQuiz: lesson.hasQuiz,
      })),
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
    await connectDB();
    const locale = await getLocale();

    const currentModule = await Module.findById(currentModuleId).lean();
    if (!currentModule) return null;

    const nextModule = await Module.findOne({
      courseId: currentModule.courseId,
      order: { $gt: currentModule.order },
      isPublished: true,
    })
      .sort({ order: 1 })
      .lean();

    if (!nextModule) return null;

    return {
      _id: nextModule._id.toString(),
      title: locale === "fr" ? nextModule.titleFr : nextModule.title,
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
    await connectDB();
    const locale = await getLocale();

    const currentModule = await Module.findById(currentModuleId).lean();
    if (!currentModule) return null;

    const previousModule = await Module.findOne({
      courseId: currentModule.courseId,
      order: { $lt: currentModule.order },
      isPublished: true,
    })
      .sort({ order: -1 })
      .lean();

    if (!previousModule) return null;

    return {
      _id: previousModule._id.toString(),
      title: locale === "fr" ? previousModule.titleFr : previousModule.title,
      slug: previousModule.slug,
      order: previousModule.order,
    };
  } catch (error) {
    console.error("Error fetching previous module:", error);
    return null;
  }
}
