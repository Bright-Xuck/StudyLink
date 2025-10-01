"use server";

import { connectDB } from "@/lib/db";
import Module from "@/lib/models/Module";
import { getLocale } from "next-intl/server";

export async function getAllModules() {
  try {
    await connectDB();
    const locale = await getLocale();

    const modules = await Module.find({ isPublished: true })
      .sort({ order: 1 })
      .lean();

    // Transform data based on locale
    return modules.map((module) => ({
      _id: module._id.toString(),
      title: locale === "fr" ? module.titleFr : module.title,
      description: locale === "fr" ? module.descriptionFr : module.description,
      slug: module.slug,
      imageUrl: module.imageUrl,
      isFree: module.isFree,
      price: module.price,
      duration: module.duration,
      level: module.level,
      order: module.order,
    }));
  } catch (error) {
    console.error("Error fetching modules:", error);
    return [];
  }
}

export async function getModuleBySlug(slug: string) {
  try {
    await connectDB();
    const locale = await getLocale();

    // eslint-disable-next-line @next/next/no-assign-module-variable
    const module = await Module.findOne({ slug, isPublished: true }).lean();

    if (!module) {
      return null;
    }

    return {
      _id: module._id.toString(),
      title: locale === "fr" ? module.titleFr : module.title,
      description: locale === "fr" ? module.descriptionFr : module.description,
      content: locale === "fr" ? module.contentFr : module.content,
      objectives: locale === "fr" ? module.objectivesFr : module.objectives,
      slug: module.slug,
      imageUrl: module.imageUrl,
      isFree: module.isFree,
      price: module.price,
      duration: module.duration,
      level: module.level,
      order: module.order,
      lessons: module.lessons,
    };
  } catch (error) {
    console.error("Error fetching module:", error);
    return null;
  }
}

export async function getFeaturedModules(limit: number = 6) {
  try {
    await connectDB();
    const locale = await getLocale();

    const modules = await Module.find({ isPublished: true })
      .sort({ order: 1 })
      .limit(limit)
      .lean();

    return modules.map((module) => ({
      _id: module._id.toString(),
      title: locale === "fr" ? module.titleFr : module.title,
      description: locale === "fr" ? module.descriptionFr : module.description,
      slug: module.slug,
      imageUrl: module.imageUrl,
      isFree: module.isFree,
      price: module.price,
      duration: module.duration,
      level: module.level,
    }));
  } catch (error) {
    console.error("Error fetching featured modules:", error);
    return [];
  }
}
