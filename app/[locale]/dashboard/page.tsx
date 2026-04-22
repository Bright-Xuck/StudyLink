'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { CourseCard } from '@/components/features/CourseCard';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  const inProgressCourses = [
    {
      id: '1',
      title: 'React Fundamentals',
      description: 'Learn the basics of React',
      instructor: 'Sarah Johnson',
      level: 'Beginner' as const,
      lessons: 24,
      students: 3200,
      subject: 'Frontend',
    },
  ];

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('welcome')} 👋</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--color-foreground-muted)]">
              Continue your learning journey and master new skills today.
            </p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-[var(--color-accent)]">5</p>
              <p className="text-sm text-[var(--color-foreground-muted)]">{t('in_progress')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-[var(--color-accent)]">12</p>
              <p className="text-sm text-[var(--color-foreground-muted)]">{t('completed')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-[var(--color-accent)]">42</p>
              <p className="text-sm text-[var(--color-foreground-muted)]">Current Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* In Progress Courses */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t('in_progress')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map(course => (
              <CourseCard key={course.id} {...course} onEnroll={() => {}} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t('recent_activity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--color-foreground-muted)]">
              No recent activity yet. Start learning now!
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
