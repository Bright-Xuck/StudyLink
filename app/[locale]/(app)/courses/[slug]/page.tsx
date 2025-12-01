import { getCourseBySlug } from '@/lib/actions/course.actions';
import { getModulesByCourse } from '@/lib/actions/module.actions';
import { checkCourseAccess } from '@/lib/actions/enrollment.actions';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { 
  Clock, 
  BookOpen, 
  TrendingUp, 
  CheckCircle2,
  Users,
  Target
} from 'lucide-react';
import ModuleCard from '@/components/modules/ModuleCard';
import EnrollButton from '@/components/modules/EnrollButton';

interface CourseDetailPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const t = await getTranslations('CourseDetailPage');

  // Fetch course details
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  // Fetch modules for this course
  const modules = await getModulesByCourse(course._id);

  // Check if user has access
  const hasAccess = await checkCourseAccess(course._id);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-success/20 text-success';
      case 'intermediate':
        return 'bg-warning/20 text-warning';
      case 'advanced':
        return 'bg-accent/20 text-accent';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'intermediate':
        return <BookOpen className="w-5 h-5" />;
      case 'advanced':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Course Info */}
            <div>
              {/* Level Badge */}
              <div className="inline-flex items-center gap-2 mb-4">
                <span className={`${getLevelColor(course.level)} px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2`}>
                  {getLevelIcon(course.level)}
                  <span className="capitalize">{course.level}</span>
                </span>
                {course.isFree && (
                  <span className="bg-success text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                    {t('free')}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {course.title}
              </h1>

              <p className="text-xl opacity-90 mb-6">
                {course.description}
              </p>

              {/* Course Meta */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{modules.length} {t('modules')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{course.enrolledCount || 0} {t('enrolled')}</span>
                </div>
              </div>

              {/* Department & Faculty */}
              <div className="space-y-2 mb-8">
                <p className="text-lg font-semibold">{course.department}</p>
                <p className="opacity-80">{course.faculty}</p>
              </div>

              {/* Enroll Button */}
              <EnrollButton
                courseId={course._id}
                isFree={course.isFree}
                price={course.price || 0}
                hasAccess={hasAccess}
                slug={course.slug}
              />
            </div>

            {/* Right: Course Image */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
                priority
              />
            </div>
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Course Details */}
          <div className="lg:col-span-2">
            {/* What You'll Learn */}
            {course.objectives && course.objectives.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-primary" />
                  <h2 className="text-3xl font-bold">{t('objectives.title')}</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                        <span className="text-muted-foreground">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Course Modules */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-bold">{t('courseContent.title')}</h2>
              </div>

              {modules.length > 0 ? (
                <div className="space-y-6">
                  <p className="text-muted-foreground mb-6">
                    {modules.length} {t('courseContent.modulesCount')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {modules.map((moduleItem) => (
                      <ModuleCard
                        key={moduleItem._id}
                        id={moduleItem._id}
                        title={moduleItem.title}
                        description={moduleItem.description}
                        imageUrl={moduleItem.imageUrl}
                        isFree={course.isFree || hasAccess}
                        price={course.isFree ? 0 : course.price}
                        slug={moduleItem.slug}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-muted rounded-xl">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('courseContent.noModules')}</p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-card border-2 border-primary rounded-xl p-6 sticky top-24">
              <div className="text-center mb-6">
                {course.isFree ? (
                  <div>
                    <p className="text-4xl font-bold text-success mb-2">
                      {t('free')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('pricing.freeAccess')}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('pricing.oneTimePayment')}
                    </p>
                    <p className="text-4xl font-bold mb-1">
                      {course.price?.toLocaleString()} <span className="text-xl">XAF</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('pricing.lifetimeAccess')}
                    </p>
                  </div>
                )}
              </div>

              {/* Includes */}
              <div className="border-t border-border pt-6 space-y-3">
                <p className="font-semibold mb-4">{t('includes.title')}</p>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  <span>{modules.length} {t('includes.modules')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  <span>{t('includes.lifetimeAccess')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  <span>{t('includes.certificate')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  <span>{t('includes.quizzes')}</span>
                </div>
              </div>

              {/* Enroll Button */}
              <div className="mt-6">
                <EnrollButton
                  courseId={course._id}
                  isFree={course.isFree}
                  price={course.price || 0}
                  hasAccess={hasAccess}
                  slug={course.slug}
                  fullWidth
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}