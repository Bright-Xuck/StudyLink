'use client';

import { useTranslations } from 'next-intl';
import { TrendingUp, BookOpen } from 'lucide-react';

interface ProgressData {
  courseId: {
    _id: string;
    title: string;
    slug: string;
  };
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  completedModules: number;
  totalModules: number;
  completedAt?: string;
}

interface ProgressChartProps {
  progressData: ProgressData[];
}

export default function ProgressChart({ progressData }: ProgressChartProps) {
  const t = useTranslations('dashboard');

  // Filter out completed courses and sort by progress
  const activeProgress = progressData
    .filter(p => !p.completedAt)
    .sort((a, b) => b.progressPercentage - a.progressPercentage)
    .slice(0, 5); // Show top 5 active courses

  if (activeProgress.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {t('learningProgress')}
        </h3>
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{t('noActiveProgress')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        {t('learningProgress')}
      </h3>

      <div className="space-y-6">
        {activeProgress.map((progress) => {
          const percentage = progress.progressPercentage;
          const course = progress.courseId;

          return (
            <div key={course._id} className="space-y-2">
              {/* Course Title */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {course.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {progress.completedLessons}/{progress.totalLessons} {t('lessons')} &ldquo; {' '}
                    {progress.completedModules}/{progress.totalModules} {t('modules')}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {progressData.length > 5 && (
        <p className="text-xs text-muted-foreground mt-4 text-center">
          {t('showingTop')} 5 {t('activeCourses')}
        </p>
      )}
    </div>
  );
}
