import CourseCard from '@/components/modules/CourseCard';
import { getAllCourses } from '@/lib/actions/course.actions';
import { BookOpen } from 'lucide-react';
import { getTranslations } from "next-intl/server";

export default async function CoursesPage() {
  const t = await getTranslations('CoursesPage');
  const courses = await getAllCourses();

  const freeCourses = courses.filter(c => c.isFree);
  const paidCourses = courses.filter(c => !c.isFree);

  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative bg-primary text-primary-foreground  lg:py-46 py-20 md:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('header.title')}
            </h1>
            <p className="text-xl opacity-90">
              {t('header.description')}
            </p>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-background">
            <path
                d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="currentColor"
            />
            </svg>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Free Courses Section */}
        {freeCourses.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {t('freeCourses.title')}
                </h2>
                <p className="text-muted-foreground">
                  {t('freeCourses.description')}
                </p>
              </div>
              <span className="bg-accent text-accent-foreground px-4 py-2 rounded-full font-semibold">
                {freeCourses.length} {t('freeCourses.countLabel')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {freeCourses.map((course) => (
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
          </section>
        )}

        {/* Premium Courses Section */}
        {paidCourses.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {t('premiumCourses.title')}
                </h2>
                <p className="text-muted-foreground">
                  {t('premiumCourses.description')}
                </p>
              </div>
              <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold">
                {paidCourses.length} {t('premiumCourses.countLabel')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paidCourses.map((course) => (
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
          </section>
        )}

        {/* Empty State */}
        {courses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {t('emptyState.title')}
            </h3>
            <p className="text-muted-foreground">
              {t('emptyState.description')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}