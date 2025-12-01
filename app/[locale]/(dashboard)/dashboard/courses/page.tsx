import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/actions/auth.actions";
import { getUserEnrolledModules } from "@/lib/actions/enrollment.actions";
import { getAllUserProgress } from "@/lib/actions/progress.actions";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle } from "lucide-react";

interface ModuleData {
  _id: string;
  title: string;
  description: string;
  slug: string;
  imageUrl: string;
  isFree?: boolean;
  price?: number;
  duration: string;
  level: string;
}

interface ProgressData {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    description: string;
    slug: string;
    imageUrl: string;
  };
  progressPercentage: number;
  completedAt?: string;
  totalLessons: number;
  completedLessons: number;
  totalModules: number;
  completedModules: number;
}

export default async function MyCoursesPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const t = await getTranslations("myCourses");
  const [enrolledModules, allProgress] = await Promise.all([
    getUserEnrolledModules(),
    getAllUserProgress(),
  ]);

  // Separate completed and in-progress courses
  const completedCourses = (allProgress as ProgressData[]).filter(
    (p: ProgressData) => p.completedAt
  );
  const inProgressCourses = (allProgress as ProgressData[]).filter(
    (p: ProgressData) => !p.completedAt
  );
  const notStartedCourses = (enrolledModules as ModuleData[]).filter(
    (course: ModuleData) =>
      !(allProgress as ProgressData[]).find(
        (p: ProgressData) =>
          p.courseId._id?.toString() === course._id ||
          (p.courseId as unknown as string) === course._id
      )
  );

  // Check if user has any courses (from either enrolledModules or allProgress)
  const hasAnyCourses = enrolledModules.length > 0 || allProgress.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-8 md:px-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("totalEnrolled")}</p>
                <p className="text-2xl font-bold text-foreground">
                  {enrolledModules.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-secondary p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("inProgress")}</p>
                <p className="text-2xl font-bold text-foreground">
                  {inProgressCourses.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-accent/20 p-3 rounded-lg">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("completed")}</p>
                <p className="text-2xl font-bold text-foreground">
                  {completedCourses.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!hasAnyCourses ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t("noCourses")}
            </h3>
            <p className="text-muted-foreground mb-6">{t("noCoursesMessage")}</p>
            <Link
              href="/courses"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              {t("browseCourses")}
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* In Progress Courses */}
            {inProgressCourses.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  {t("continueWhere")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgressCourses.map((progress: ProgressData) => {
                    const course = progress.courseId;
                    return (
                      <Link
                        key={progress._id}
                        href={`/courses/${course.slug}`}
                        className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-colors group"
                      >
                        <div className="relative h-48">
                          <Image
                            src={course.imageUrl}
                            alt={course.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4">
                            <div className="bg-foreground/80 text-background px-3 py-1 rounded-full text-sm font-medium">
                              {progress.progressPercentage}%
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {course.description}
                          </p>
                          <div className="space-y-3">
                            <div className="bg-muted rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-primary h-full transition-all"
                                style={{ width: `${progress.progressPercentage}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>
                                {progress.completedLessons}/{progress.totalLessons} {t("lessons")}
                              </span>
                              <span>
                                {progress.completedModules}/{progress.totalModules} {t("modules")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Courses */}
            {completedCourses.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-accent" />
                  {t("completedCourses")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedCourses.map((progress: ProgressData) => {
                    const course = progress.courseId;
                    return (
                      <Link
                        key={progress._id}
                        href={`/courses/${course.slug}`}
                        className="bg-card border border-border rounded-xl overflow-hidden hover:border-accent transition-colors group"
                      >
                        <div className="relative h-48">
                          <Image
                            src={course.imageUrl}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                            <div className="bg-accent/90 text-accent-foreground px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                              <CheckCircle className="h-5 w-5" />
                              {t("completed")}
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {course.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Not Started Courses */}
            {notStartedCourses.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Play className="h-6 w-6 text-secondary" />
                  {t("readyToStart")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notStartedCourses.map((course: ModuleData) => (
                    <Link
                      key={course._id}
                      href={`/courses/${course.slug}`}
                      className="bg-card border border-border rounded-xl overflow-hidden hover:border-secondary transition-colors group"
                    >
                      <div className="relative h-48">
                        <Image
                          src={course.imageUrl}
                          alt={course.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {course.isFree && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold">
                              {t("free")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {!course.isFree && (
                              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">
                                {t("premium")}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {course.duration}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-2 text-secondary text-sm font-medium">
                          <Play className="h-4 w-4" />
                          <span>{t("startNow")}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
