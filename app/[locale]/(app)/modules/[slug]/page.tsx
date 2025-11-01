import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getModuleBySlug } from '@/lib/actions/module.actions';
import { getAuthenticatedUser } from '@/lib/actions/auth.actions';
import { checkModuleAccess } from '@/lib/actions/enrollment.actions';
import { getCourseProgress } from '@/lib/actions/progress.actions';
import { Clock, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import ModuleContent from '@/components/modules/ModuleContent';
import Image from "next/image";
import { Link } from '@/i18n/navigation';

type ModuleDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ModuleDetailPage({ params, searchParams }: ModuleDetailPageProps) {
  const { slug } = await params;
  const { lesson: lessonParam } = await searchParams;

  if (!slug) {
    return notFound();
  }

  const t = await getTranslations('module');

  const [courseModule, user] = await Promise.all([
    getModuleBySlug(slug),
    getAuthenticatedUser(),
  ]);

  if (!courseModule) {
    return notFound();
  }

  // Check if user has access to this module (via parent course)
  const hasAccess = await checkModuleAccess(courseModule._id);

  // Get course progress (module progress is tracked at course level now)
  let progress = null;
  if (hasAccess && user && courseModule.courseId) {
    progress = await getCourseProgress(courseModule.courseId);
  }

  // Find this module's progress within course progress
  const moduleProgress = progress?.modulesProgress?.find(
    (mp: { moduleId: string }) => mp.moduleId.toString() === courseModule._id
  );

  const showSidebar = !lessonParam;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary text-primary-foreground lg:py-46 py-20 md:py-32">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_1px)] bg-[length:24px_24px]" />
          
          <div className="container mx-auto px-4 md:px-8">
            <div className="relative z-10">
              {/* Back to Course Link */}
              {courseModule.courseSlug && (
                <Link 
                  href={`/courses/${courseModule.courseSlug}`}
                  className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{t('backToCourse')}</span>
                </Link>
              )}

              {/* Course Name */}
              {courseModule.courseName && (
                <p className="text-lg opacity-80 mb-2">{courseModule.courseName}</p>
              )}

              {/* Level Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary-foreground/20 text-primary-foreground px-3 py-1 rounded-full text-sm capitalize">
                  {courseModule.level}
                </span>
                {courseModule.isFree && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {t('free')}
                  </span>
                )}
              </div>

              {/* Module Title & Description */}
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{courseModule.title}</h1>
              <p className="text-xl opacity-90 mb-6">{courseModule.description}</p>

              {/* Module Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{courseModule.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{courseModule.lessons?.length || 0} {t('lessons')}</span>
                </div>
                {hasAccess && moduleProgress && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span>{moduleProgress.progressPercentage || 0}% {t('complete')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-background"
            >
              <path
                d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 md:px-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className={`${showSidebar ? "lg:col-span-2" : "lg:col-span-3"} space-y-8`}>
              {/* Learning Objectives */}
              {courseModule.objectives && courseModule.objectives.length > 0 && (
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {t('learningObjectives')}
                  </h2>
                  <ul className="space-y-3">
                    {courseModule.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Module Content or Access Denied */}
              {hasAccess ? (
                <ModuleContent 
                  lessons={JSON.parse(JSON.stringify(courseModule.lessons || []))} 
                  moduleId={courseModule._id}
                  courseId={courseModule.courseId}
                  userId={user?.id || "anonymous"}
                  progress={progress}
                />
              ) : (
                <div className="bg-card rounded-xl p-12 border-2 border-primary/20 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {t('enrollInCourse')}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {t('enrollInCourseDescription')}
                    </p>
                    {courseModule.courseSlug && (
                      <Link href={`/courses/${courseModule.courseSlug}`}>
                        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                          {t('viewCourse')}
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            {showSidebar && (
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
                  {/* Module Image */}
                  <div className="mb-6">
                    <Image
                      src={courseModule.imageUrl}
                      alt={courseModule.title}
                      width={400}
                      height={225}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>

                  {/* Module Info */}
                  <div className="space-y-4 text-sm">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('moduleInfo')}</h3>
                      <div className="space-y-3 text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>{t('duration')}</span>
                          <span className="text-foreground font-medium">{courseModule.duration}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t('level')}</span>
                          <span className="text-foreground font-medium capitalize">
                            {courseModule.level}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t('lessons')}</span>
                          <span className="text-foreground font-medium">
                            {courseModule.lessons?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress (if enrolled) */}
                    {hasAccess && moduleProgress && (
                      <div className="pt-4 border-t border-border">
                        <h3 className="font-semibold text-foreground mb-2">{t('yourProgress')}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{t('completed')}</span>
                            <span className="text-foreground font-medium">
                              {moduleProgress.completedLessons || 0} / {moduleProgress.totalLessons || 0}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${moduleProgress.progressPercentage || 0}%` }}
                            />
                          </div>
                          <p className="text-center text-sm font-semibold text-primary">
                            {moduleProgress.progressPercentage || 0}%
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Course Link */}
                    {courseModule.courseSlug && (
                      <div className="pt-4 border-t border-border">
                        <Link 
                          href={`/courses/${courseModule.courseSlug}`}
                          className="block text-center text-primary hover:underline"
                        >
                          {t('viewFullCourse')} →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}