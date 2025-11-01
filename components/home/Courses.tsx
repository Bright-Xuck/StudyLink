'use client';

import { useTranslations } from 'next-intl';
import CourseCard from '@/components/modules/CourseCard';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import { Link } from '@/i18n/navigation';

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
  const t = useTranslations('courses');

  // Show only first 6 courses on homepage
  const featuredCourses = courses.slice(0, 6);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredCourses.map((course) => (
            <CourseCard
              key={course._id}
              id={course._id}
              title={course.title}
              description={course.description}
              imageUrl={course.imageUrl}
              department={course.department}
              faculty={course.faculty || ""}
              isFree={course.isFree}
              price={course.price || 0}
              duration={course.duration}
              level={course.level}
              slug={course.slug}
              moduleCount={course.moduleCount}
            />
          ))}
        </div>

        {/* View All Courses Button */}
        {courses.length > 6 && (
          <div className="text-center">
            <Link href="/courses">
              <Button variant="outline" size="lg" className="group">
                {t('viewAll')}
                <TrendingUp className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}