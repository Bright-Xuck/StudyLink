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
} from "lucide-react";

interface ModuleData {
  _id: string;
  title: string;
  description: string;
  slug: string;
  imageUrl: string;
  isFree: boolean;
  price?: number;
  duration: string;
  level: string;
}

interface ProgressData {
  _id: string;
  moduleId: {
    _id: string;
    title: string;
    description: string;
    slug: string;
    imageUrl: string;
  };
  progressPercentage: number;
  completedAt?: string;
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
            {/* Total Modules */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("totalModules")}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {userStats.totalModules}
                  </p>
                </div>
              </div>
            </div>

            {/* Completed Modules */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("completed")}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {userStats.completedModules}
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
                    {Math.round(userStats.totalTimeSpent / 60)}h
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
          </div>
        )}

        {/* Continue Learning Section */}
        {allProgress && allProgress.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {t("continueLearning")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(allProgress as ProgressData[])
                .filter((p: ProgressData) => !p.completedAt)
                .slice(0, 3)
                .map((progress: ProgressData) => {
                  const courseModule = progress.moduleId;
                  return (
                    <Link
                      key={progress._id}
                      href={`/modules/${courseModule.slug}`}
                      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-colors group"
                    >
                      <div className="relative h-48">
                        <Image
                          src={courseModule.imageUrl}
                          alt={courseModule.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-2 text-background text-sm mb-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>{progress.progressPercentage}% {t("complete")}</span>
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
                          {courseModule.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {courseModule.description}
                        </p>
                        <div className="flex items-center gap-2 text-primary">
                          <Play className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {t("continueLesson")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}

        {/* All Enrolled Modules */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {t("myModules")}
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
                {t("noModulesYet")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("noModulesMessage")}
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
              {(enrolledModules as ModuleData[]).map((courseModule: ModuleData) => {
                const moduleProgress = (allProgress as ProgressData[])?.find(
                  (p: ProgressData) =>
                    p.moduleId._id?.toString() === courseModule._id ||
                    (p.moduleId as unknown as string) === courseModule._id
                );

                return (
                  <Link
                    key={courseModule._id}
                    href={`/modules/${courseModule.slug}`}
                    className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-colors"
                  >
                    <div className="relative h-48">
                      <Image
                        src={courseModule.imageUrl}
                        alt={courseModule.title}
                        fill
                        className="object-cover"
                      />
                      {moduleProgress && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-foreground/60 text-background px-3 py-1 rounded-full text-sm font-medium">
                            {moduleProgress.progressPercentage}%
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        {courseModule.isFree ? (
                          <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold">
                            {t("free")}
                          </span>
                        ) : (
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">
                            {t("premium")}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {courseModule.duration}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {courseModule.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {courseModule.description}
                      </p>

                      {/* Progress Bar */}
                      {moduleProgress && (
                        <div className="mt-4">
                          <div className="bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary h-full transition-all"
                              style={{
                                width: `${moduleProgress.progressPercentage}%`,
                              }}
                            />
                          </div>
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