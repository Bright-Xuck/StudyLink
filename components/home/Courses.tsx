"use client";

import { useTranslations } from "next-intl";
import CourseCard from "@/components/modules/CourseCard";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Projects from "../modules/projects";

interface Course {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  department: string;
  faculty?: string;
  isFree: boolean;
  price?: number;
  duration: string;
  level: string;
  slug: string;
  moduleCount?: number;
}

interface CoursesProps {
  courses: Course[];
}

export default function Courses({ courses }: CoursesProps) {
  return <Projects />;
}
