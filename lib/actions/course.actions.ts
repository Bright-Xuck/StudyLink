"use server";

import { connectDB } from "@/lib/db";
import { getLocale } from "next-intl/server";

export interface CourseListItem {
  _id: string;
  title: string;
  description: string;
  slug: string;
  imageUrl: string;
  department: string;
  faculty: string;
  isFree: boolean;
  price: number;
  currency: string;
  duration: string;
  level: string;
  order: number;
  moduleCount: number;
  enrolledCount: number;
}

export interface CourseDetailItem extends CourseListItem {
  objectives: string[];
  prerequisites: string[];
  instructor?: string;
  instructorBio?: string;
  modules: unknown[];
}

/**
 * Get all published courses
 */
export async function getAllCourses(): Promise<CourseListItem[]> {
  try {
    const sql = await connectDB();
    const locale = await getLocale();

    const courses = await sql`
      SELECT
        id,
        title,
        title_fr,
        description,
        description_fr,
        slug,
        image_url,
        department,
        faculty,
        is_free,
        price,
        currency,
        duration,
        level,
        "order",
        enrolled_count,
        (
          SELECT COUNT(*)
          FROM modules
          WHERE modules.course_id = courses.id
            AND modules.is_published = TRUE
        )::int AS module_count
      FROM courses
      WHERE is_published = TRUE
      ORDER BY "order" ASC
    `;

    return courses.map((course) => ({
      _id: course.id,
      title: locale === "fr" ? course.title_fr : course.title,
      description: locale === "fr" ? course.description_fr : course.description,
      slug: course.slug,
      imageUrl: course.image_url,
      department: course.department ?? "",
      faculty: course.faculty ?? "",
      isFree: course.is_free,
      price: Number(course.price),
      currency: course.currency ?? "XAF",
      duration: course.duration ?? "",
      level: course.level ?? "beginner",
      order: course.order,
      moduleCount: Number(course.module_count ?? 0),
      enrolledCount: Number(course.enrolled_count ?? 0),
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

/**
 * Get course by slug with all modules
 */
export async function getCourseBySlug(slug: string): Promise<CourseDetailItem | null> {
  try {
    const sql = await connectDB();
    const locale = await getLocale();

    const [course] = await sql`
      SELECT
        id,
        title,
        title_fr,
        description,
        description_fr,
        objectives,
        objectives_fr,
        prerequisites,
        prerequisites_fr,
        slug,
        image_url,
        department,
        faculty,
        is_free,
        price,
        currency,
        duration,
        level,
        instructor,
        instructor_bio,
        enrolled_count
      FROM courses
      WHERE slug = ${slug} AND is_published = TRUE
      LIMIT 1
    `;

    if (!course) {
      return null;
    }

    const modules = await sql`
      SELECT id, title, title_fr, description, description_fr, slug, image_url, duration, level, "order"
      FROM modules
      WHERE course_id = ${course.id} AND is_published = TRUE
      ORDER BY "order" ASC
    `;

    return {
      _id: course.id,
      title: locale === "fr" ? course.title_fr : course.title,
      description: locale === "fr" ? course.description_fr : course.description,
      objectives: locale === "fr" ? course.objectives_fr : course.objectives,
      prerequisites: locale === "fr" ? course.prerequisites_fr : course.prerequisites,
      slug: course.slug,
      imageUrl: course.image_url,
      department: course.department ?? "",
      faculty: course.faculty ?? "",
      isFree: course.is_free,
      price: Number(course.price),
      currency: course.currency ?? "XAF",
      duration: course.duration ?? "",
      level: course.level ?? "beginner",
      instructor: course.instructor ?? "",
      instructorBio: course.instructor_bio ?? "",
      modules,
      order: 0,
      moduleCount: modules.length,
      enrolledCount: Number(course.enrolled_count ?? 0),
    };
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

/**
 * Get courses by department
 */
export async function getCoursesByDepartment(department: string) {
  try {
    const sql = await connectDB();
    const locale = await getLocale();

    const courses = await sql`
      SELECT id, title, title_fr, description, description_fr, slug, image_url, is_free, price, duration, level,
             (SELECT COUNT(*) FROM modules WHERE modules.course_id = courses.id AND modules.is_published = TRUE)::int AS module_count
      FROM courses
      WHERE department = ${department} AND is_published = TRUE
      ORDER BY "order" ASC
    `;

    return courses.map((course) => ({
      _id: course.id,
      title: locale === "fr" ? course.title_fr : course.title,
      description: locale === "fr" ? course.description_fr : course.description,
      slug: course.slug,
      imageUrl: course.image_url,
      isFree: Boolean(course.is_free),
      price: Number(course.price ?? 0),
      duration: course.duration ?? "",
      level: course.level ?? "beginner",
      moduleCount: Number(course.module_count ?? 0),
    }));
  } catch (error) {
    console.error("Error fetching courses by department:", error);
    return [];
  }
}

/**
 * Get featured courses (first 6)
 */
export async function getFeaturedCourses(limit: number = 6) {
  try {
    const sql = await connectDB();
    const locale = await getLocale();

    const courses = await sql`
      SELECT id, title, title_fr, description, description_fr, slug, image_url, department, is_free, price, duration, level,
             (SELECT COUNT(*) FROM modules WHERE modules.course_id = courses.id AND modules.is_published = TRUE)::int AS module_count
      FROM courses
      WHERE is_published = TRUE
      ORDER BY "order" ASC
      LIMIT ${limit}
    `;

    return courses.map((course) => ({
      _id: course.id,
      title: locale === "fr" ? course.title_fr : course.title,
      description: locale === "fr" ? course.description_fr : course.description,
      slug: course.slug,
      imageUrl: course.image_url,
      department: course.department ?? "",
      isFree: Boolean(course.is_free),
      price: Number(course.price ?? 0),
      duration: course.duration ?? "",
      level: course.level ?? "beginner",
      moduleCount: Number(course.module_count ?? 0),
    }));
  } catch (error) {
    console.error("Error fetching featured courses:", error);
    return [];
  }
}

/**
 * Get course modules by course ID
 */
export async function getCourseModules(courseId: string) {
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

    return modules.map((module) => ({
      _id: module.id,
      title: locale === "fr" ? module.title_fr : module.title,
      description: locale === "fr" ? module.description_fr : module.description,
      slug: module.slug,
      imageUrl: module.image_url,
      duration: module.duration ?? "",
      level: module.level ?? "beginner",
      order: module.order,
      lessonCount: Number(module.lesson_count ?? 0),
    }));
  } catch (error) {
    console.error("Error fetching course modules:", error);
    return [];
  }
}

/**
 * Get all departments with course counts
 */
export async function getDepartmentsWithCourses() {
  try {
    const sql = await connectDB();

    const departments = await sql`
      SELECT department, faculty, COUNT(*)::int AS course_count
      FROM courses
      WHERE is_published = TRUE
      GROUP BY department, faculty
      ORDER BY department ASC
    `;

    return departments.map((dept) => ({
      department: dept.department,
      faculty: dept.faculty ?? "",
      courseCount: Number(dept.course_count ?? 0),
    }));
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
}
