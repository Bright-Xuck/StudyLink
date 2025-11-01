import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/actions/auth.actions";
import { getUserEnrolledModules } from "@/lib/actions/enrollment.actions";
import { getUserStats, getAllUserProgress } from "@/lib/actions/progress.actions";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  Play,
  FileText,
  BarChart3,
} from "lucide-react";

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

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const t = await getTranslations("dashboard");

  const [enrolledModules, userStats, allProgress] = await Promise.all([
    getUserEnrolledModules(),
    getUserStats(),
    getAllUserProgress(),
  ]);

  // Format time spent into hours and minutes
  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-8 md:px-8 md:py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t("welcome")}, {user.name}!
          </h1>
          <p className="text-muted-foreground">{t("welcomeMessage")}</p>
        </div>

        {/* Stats Grid */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Courses */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("totalCourses")}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {userStats.totalCourses}
                  </p>
                </div>
              </div>
            </div>

            {/* Completed Courses */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("completedCourses")}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {userStats.completedCourses}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Spent */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("timeSpent")}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatTimeSpent(userStats.totalTimeSpent)}
                  </p>
                </div>
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("certificates")}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {userStats.certificatesEarned}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Stats Row */}
            <div className="bg-card border border-border rounded-xl p-6 md:col-span-2">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("lessonsCompleted")}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {userStats.totalLessonsCompleted}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("modulesCompleted")}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {userStats.totalModulesCompleted}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("quizzesPassed")}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {userStats.totalQuizzesPassed}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("inProgress")}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {userStats.inProgressCourses}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Learning Section */}
        {allProgress && allProgress.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {t("continueLearning")}
              </h2>
              <Link
                href="/courses"
                className="text-primary hover:underline text-sm font-medium"
              >
                {t("viewAllProgress")}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(allProgress as ProgressData[])
                .filter((p: ProgressData) => !p.completedAt)
                .sort((a: ProgressData, b: ProgressData) => b.progressPercentage - a.progressPercentage)
                .slice(0, 3)
                .map((progress: ProgressData) => {
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
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between text-background text-sm mb-2">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              <span>{progress.progressPercentage}% {t("complete")}</span>
                            </div>
                            <div className="text-xs bg-background/20 px-2 py-1 rounded">
                              {progress.completedLessons}/{progress.totalLessons} {t("lessons")}
                            </div>
                          </div>
                          <div className="bg-background/20 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary h-full transition-all"
                              style={{
                                width: `${progress.progressPercentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-primary">
                            <Play className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {t("continueCourse")}
                            </span>
                          </div>
                          {progress.completedModules > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {progress.completedModules}/{progress.totalModules} {t("modules")}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}

        {/* All Enrolled Courses */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {t("myCourses")}
            </h2>
            <Link
              href="/courses"
              className="text-primary hover:underline text-sm font-medium"
            >
              {t("browseAll")}
            </Link>
          </div>

          {enrolledModules.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t("noCoursesYet")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("noCoursesMessage")}
              </p>
              <Link
                href="/courses"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                {t("exploreCourses")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(enrolledModules as ModuleData[]).map((course: ModuleData) => {
                const courseProgress = (allProgress as ProgressData[])?.find(
                  (p: ProgressData) =>
                    p.courseId._id?.toString() === course._id ||
                    (p.courseId as unknown as string) === course._id
                );

                return (
                  <Link
                    key={course._id}
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
                      {courseProgress && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-foreground/80 text-background px-3 py-1 rounded-full text-sm font-medium">
                            {courseProgress.progressPercentage}%
                          </div>
                        </div>
                      )}
                      {course.isFree && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
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
                            {course.duration}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground capitalize">
                          {course.level}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {course.description}
                      </p>

                      {/* Progress Bar and Stats */}
                      {courseProgress ? (
                        <div className="space-y-3">
                          <div className="bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary h-full transition-all"
                              style={{
                                width: `${courseProgress.progressPercentage}%`,
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              {courseProgress.completedLessons}/{courseProgress.totalLessons} {t("lessons")}
                            </span>
                            <span>
                              {courseProgress.completedModules}/{courseProgress.totalModules} {t("modules")}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-primary text-sm">
                          <FileText className="h-4 w-4" />
                          <span>{t("startLearning")}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}