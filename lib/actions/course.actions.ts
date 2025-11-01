"use server";

import { connectDB } from "@/lib/db";
import Course from "@/lib/models/Course";
import Module from "@/lib/models/Module";
import { getLocale } from "next-intl/server";

/**
 * Get all published courses
 */
export async function getAllCourses() {
  try {
    await connectDB();
    const locale = await getLocale();

    const courses = await Course.find({ isPublished: true })
      .populate("modules")
      .sort({ order: 1 })
      .lean();

    // Transform data based on locale
    return courses.map((course) => ({
      _id: course._id.toString(),
      title: locale === "fr" ? course.titleFr : course.title,
      description: locale === "fr" ? course.descriptionFr : course.description,
      slug: course.slug,
      imageUrl: course.imageUrl,
      department: course.department,
      faculty: course.faculty,
      isFree: course.isFree,
      price: course.price,
      currency: course.currency,
      duration: course.duration,
      level: course.level,
      order: course.order,
      moduleCount: course.modules.length,
      enrolledCount: course.enrolledCount,
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

/**
 * Get course by slug with all modules
 */
export async function getCourseBySlug(slug: string) {
  try {
    await connectDB();
    const locale = await getLocale();

    const course = await Course.findOne({ slug, isPublished: true })
      .populate("modules")
      .lean();

    if (!course) {
      return null;
    }

    return {
      _id: course._id.toString(),
      title: locale === "fr" ? course.titleFr : course.title,
      description: locale === "fr" ? course.descriptionFr : course.description,
      objectives: locale === "fr" ? course.objectivesFr : course.objectives,
      prerequisites:
        locale === "fr" ? course.prerequisitesFr : course.prerequisites,
      slug: course.slug,
      imageUrl: course.imageUrl,
      department: course.department,
      faculty: course.faculty,
      isFree: course.isFree,
      price: course.price,
      currency: course.currency,
      duration: course.duration,
      level: course.level,
      instructor: course.instructor,
      instructorBio: course.instructorBio,
      modules: course.modules,
      enrolledCount: course.enrolledCount,
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
    await connectDB();
    const locale = await getLocale();

    const courses = await Course.find({
      department,
      isPublished: true,
    })
      .populate("modules")
      .sort({ order: 1 })
      .lean();

    return courses.map((course) => ({
      _id: course._id.toString(),
      title: locale === "fr" ? course.titleFr : course.title,
      description: locale === "fr" ? course.descriptionFr : course.description,
      slug: course.slug,
      imageUrl: course.imageUrl,
      isFree: course.isFree,
      price: course.price,
      duration: course.duration,
      level: course.level,
      moduleCount: course.modules.length,
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
    await connectDB();
    const locale = await getLocale();

    const courses = await Course.find({ isPublished: true })
      .populate("modules")
      .sort({ order: 1 })
      .limit(limit)
      .lean();

    return courses.map((course) => ({
      _id: course._id.toString(),
      title: locale === "fr" ? course.titleFr : course.title,
      description: locale === "fr" ? course.descriptionFr : course.description,
      slug: course.slug,
      imageUrl: course.imageUrl,
      department: course.department,
      isFree: course.isFree,
      price: course.price,
      duration: course.duration,
      level: course.level,
      moduleCount: course.modules.length,
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
    await connectDB();
    const locale = await getLocale();

    const modules = await Module.find({
      courseId,
      isPublished: true,
    })
      .sort({ order: 1 })
      .lean();

    return modules.map((module) => ({
      _id: module._id.toString(),
      title: locale === "fr" ? module.titleFr : module.title,
      description: locale === "fr" ? module.descriptionFr : module.description,
      slug: module.slug,
      imageUrl: module.imageUrl,
      duration: module.duration,
      level: module.level,
      order: module.order,
      lessonCount: module.lessons.length,
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
    await connectDB();

    const departments = await Course.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: "$department",
          courseCount: { $sum: 1 },
          faculty: { $first: "$faculty" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return departments.map((dept) => ({
      department: dept._id,
      faculty: dept.faculty,
      courseCount: dept.courseCount,
    }));
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
}
