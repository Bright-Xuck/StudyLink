'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Avatar,
  AvatarGroup,
  ProgressBar,
  ProgressRing,
} from '@/components/ui';
import {
  BookOpen,
  CheckCircle2,
  Flame,
  Clock,
  ArrowRight,
  Play,
  Users,
  Calendar,
} from 'lucide-react';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  const stats = [
    {
      label: t('in_progress'),
      value: 5,
      icon: <BookOpen size={20} />,
      color: 'var(--color-info)',
      bgColor: 'var(--color-info-light)',
    },
    {
      label: t('completed'),
      value: 12,
      icon: <CheckCircle2 size={20} />,
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-light)',
    },
    {
      label: t('streak'),
      value: 42,
      icon: <Flame size={20} />,
      color: 'var(--color-warning)',
      bgColor: 'var(--color-warning-light)',
    },
  ];

  const inProgressCourses = [
    {
      id: '1',
      title: 'React Fundamentals',
      instructor: 'Sarah Johnson',
      progress: 65,
      lastActivity: '2 hours ago',
      thumbnail: null,
    },
    {
      id: '2',
      title: 'TypeScript Masterclass',
      instructor: 'Michael Chen',
      progress: 40,
      lastActivity: '1 day ago',
      thumbnail: null,
    },
    {
      id: '3',
      title: 'Node.js Backend Development',
      instructor: 'Emily Davis',
      progress: 25,
      lastActivity: '3 days ago',
      thumbnail: null,
    },
  ];

  const studyGroups = [
    {
      id: '1',
      name: 'React Study Circle',
      members: 12,
      nextSession: 'Today, 3:00 PM',
      isActive: true,
    },
    {
      id: '2',
      name: 'Algorithm Masters',
      members: 8,
      nextSession: 'Tomorrow, 5:00 PM',
      isActive: false,
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'lesson',
      title: 'Completed: React Hooks Deep Dive',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'quiz',
      title: 'Passed: JavaScript Fundamentals Quiz',
      time: '1 day ago',
    },
    {
      id: '3',
      type: 'group',
      title: 'Joined: React Study Circle',
      time: '2 days ago',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="p-6 lg:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[var(--color-foreground)] mb-1">
            {t('welcome')}, John
          </h1>
          <p className="text-[var(--color-foreground-muted)]">
            {t('greeting')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} padding="md" className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-[var(--radius)] flex items-center justify-center shrink-0"
                style={{ backgroundColor: stat.bgColor, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--color-foreground)]">
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  {stat.label}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Continue Learning */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning Section */}
            <Card padding="none">
              <CardHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle as="h2">{t('continue_learning')}</CardTitle>
                  <Link
                    href="/courses"
                    className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1"
                  >
                    View all <ArrowRight size={14} />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  {inProgressCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-4 p-4 rounded-[var(--radius)] bg-[var(--color-background)] hover:bg-[var(--color-background-alt)] transition-colors"
                    >
                      {/* Course Thumbnail */}
                      <div className="w-16 h-16 rounded-[var(--radius-sm)] bg-[var(--color-primary)] flex items-center justify-center shrink-0">
                        <BookOpen size={24} className="text-[var(--color-primary-foreground)]" />
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[var(--color-foreground)] truncate">
                          {course.title}
                        </h3>
                        <p className="text-sm text-[var(--color-foreground-muted)]">
                          {course.instructor}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <ProgressBar
                            value={course.progress}
                            size="sm"
                            className="flex-1 max-w-[200px]"
                          />
                          <span className="text-xs text-[var(--color-foreground-muted)]">
                            {course.progress}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Ring & Action */}
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--color-foreground-muted)]">
                          <Clock size={14} />
                          {course.lastActivity}
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<Play size={14} />}
                          href={`/courses/${course.id}`}
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle as="h2">{t('recent_activity')}</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3 py-2"
                      >
                        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                        <div className="flex-1">
                          <p className="text-sm text-[var(--color-foreground)]">
                            {activity.title}
                          </p>
                        </div>
                        <span className="text-xs text-[var(--color-foreground-muted)]">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--color-foreground-muted)] text-sm">
                    {t('no_activity')}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Study Groups & Quick Actions */}
          <div className="space-y-6">
            {/* Overall Progress */}
            <Card className="text-center">
              <CardContent className="py-6">
                <ProgressRing value={68} size={100} strokeWidth={8} />
                <p className="mt-4 font-medium text-[var(--color-foreground)]">
                  Overall Progress
                </p>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  Keep up the great work!
                </p>
              </CardContent>
            </Card>

            {/* Study Groups */}
            <Card padding="none">
              <CardHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle as="h2">{t('your_groups')}</CardTitle>
                  <Link
                    href="/groups"
                    className="text-sm text-[var(--color-primary)] hover:underline"
                  >
                    View all
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  {studyGroups.map((group) => (
                    <div
                      key={group.id}
                      className="p-4 rounded-[var(--radius)] bg-[var(--color-background)] border border-[var(--color-border)]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-[var(--color-foreground)]">
                            {group.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-[var(--color-foreground-muted)] mt-1">
                            <Users size={12} />
                            {group.members} members
                          </div>
                        </div>
                        {group.isActive && (
                          <Badge variant="success" size="sm">
                            Active
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--color-foreground-muted)]">
                        <Calendar size={12} />
                        Next: {group.nextSession}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle as="h2">{t('quick_actions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="secondary"
                  fullWidth
                  href="/courses"
                  className="justify-start"
                >
                  <BookOpen size={18} />
                  Browse Courses
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  href="/groups"
                  className="justify-start"
                >
                  <Users size={18} />
                  Find Study Groups
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
