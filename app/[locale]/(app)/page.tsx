import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Courses from '@/components/home/Courses';
import Form from "@/components/contactUs/form";
import CTA from "@/components/home/CTA";
import { getAllCourses } from "@/lib/actions/course.actions";
import { getFeaturedModules } from "@/lib/actions/module.actions";
import Testimonials from "../../../components/home/Testimonials";
import PopularModules from "../../../components/home/PopularModules";

export default async function HomePage() {

  const [courses, featuredModules] = await Promise.all([
    getAllCourses(),
    getFeaturedModules(3)
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Hero />
        <Features />
        <Courses courses={courses} />
        <CTA />
        <PopularModules modules={featuredModules} />
        <Testimonials />
        <CTA />
        <Form />
      </div>
    </div>
  );
}