'use client';

import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Avatar,
  ProgressBar,
  ProgressRing,
} from '@/components/ui';
import {
  BookOpen,
  Clock,
  Flame,
  Award,
  Calendar,
  Mail,
  MapPin,
  Edit2,
  Trophy,
  Target,
  Zap,
  Star,
} from 'lucide-react';

export default function ProfilePage() {
  const t = useTranslations('profile');

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'San Francisco, CA',
    bio: 'Passionate learner focusing on web development and data science. Always curious about new technologies and best practices.',
    memberSince: 'January 2024',
    avatar: null,
  };

  const stats = [
    {
      label: t('completed_courses'),
      value: 12,
      icon: <BookOpen size={20} />,
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-light)',
    },
    {
      label: t('total_hours'),
      value: 156,
      icon: <Clock size={20} />,
      color: 'var(--color-info)',
      bgColor: 'var(--color-info-light)',
    },
    {
      label: t('current_streak'),
      value: 42,
      icon: <Flame size={20} />,
      color: 'var(--color-warning)',
      bgColor: 'var(--color-warning-light)',
    },
  ];

  const achievements = [
    {
      id: '1',
      name: 'First Course',
      description: 'Completed your first course',
      icon: <Trophy size={24} />,
      earned: true,
      date: 'Jan 2024',
    },
    {
      id: '2',
      name: '7-Day Streak',
      description: 'Studied for 7 days in a row',
      icon: <Flame size={24} />,
      earned: true,
      date: 'Feb 2024',
    },
    {
      id: '3',
      name: 'Fast Learner',
      description: 'Completed 5 courses in a month',
      icon: <Zap size={24} />,
      earned: true,
      date: 'Mar 2024',
    },
    {
      id: '4',
      name: 'Top Student',
      description: 'Scored 100% on 10 quizzes',
      icon: <Star size={24} />,
      earned: true,
      date: 'Mar 2024',
    },
    {
      id: '5',
      name: 'Goal Setter',
      description: 'Set and achieved 5 learning goals',
      icon: <Target size={24} />,
      earned: false,
      progress: 60,
    },
    {
      id: '6',
      name: 'Master',
      description: 'Complete 25 courses',
      icon: <Award size={24} />,
      earned: false,
      progress: 48,
    },
  ];

  const recentCourses = [
    { id: '1', title: 'React Fundamentals', progress: 100, completedDate: '2 weeks ago' },
    { id: '2', title: 'TypeScript Essentials', progress: 100, completedDate: '1 month ago' },
    { id: '3', title: 'Node.js Backend', progress: 75, inProgress: true },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="p-6 lg:p-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <Avatar name={user.name} size="xl" className="w-24 h-24 text-2xl" />

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                  <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">
                    {user.name}
                  </h1>
                  <Badge variant="accent" size="sm">Pro Member</Badge>
                </div>

                <p className="text-[var(--color-foreground-muted)] mb-4 max-w-xl">
                  {user.bio}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-[var(--color-foreground-muted)]">
                  <span className="flex items-center gap-1">
                    <Mail size={14} />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {user.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {t('member_since')}: {user.memberSince}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <Button variant="secondary" icon={<Edit2 size={16} />}>
                {t('edit')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Achievements */}
            <Card padding="none">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle as="h2">{t('achievements')}</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-start gap-4 p-4 rounded-[var(--radius)] border ${
                        achievement.earned
                          ? 'bg-[var(--color-background-elevated)] border-[var(--color-border)]'
                          : 'bg-[var(--color-background)] border-dashed border-[var(--color-border)]'
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-[var(--radius)] flex items-center justify-center shrink-0 ${
                          achievement.earned
                            ? 'bg-[var(--color-accent-light)] text-[var(--color-accent-dark)]'
                            : 'bg-[var(--color-background-alt)] text-[var(--color-foreground-subtle)]'
                        }`}
                      >
                        {achievement.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className={`font-medium ${
                              achievement.earned
                                ? 'text-[var(--color-foreground)]'
                                : 'text-[var(--color-foreground-muted)]'
                            }`}
                          >
                            {achievement.name}
                          </p>
                          {achievement.earned && (
                            <Badge variant="success" size="sm">Earned</Badge>
                          )}
                        </div>
                        <p className="text-xs text-[var(--color-foreground-muted)] mb-2">
                          {achievement.description}
                        </p>
                        {achievement.earned ? (
                          <p className="text-xs text-[var(--color-foreground-subtle)]">
                            {achievement.date}
                          </p>
                        ) : (
                          <ProgressBar
                            value={achievement.progress || 0}
                            size="sm"
                            variant="accent"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Learning Progress */}
            <Card className="text-center">
              <CardContent className="py-6">
                <ProgressRing value={78} size={120} strokeWidth={10} variant="primary" />
                <p className="mt-4 font-medium text-[var(--color-foreground)]">
                  Overall Progress
                </p>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  You&apos;re doing great!
                </p>
              </CardContent>
            </Card>

            {/* Recent Courses */}
            <Card padding="none">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle as="h2">Recent Courses</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[var(--color-foreground)]">
                          {course.title}
                        </p>
                        {course.inProgress ? (
                          <Badge variant="info" size="sm">In Progress</Badge>
                        ) : (
                          <span className="text-xs text-[var(--color-foreground-muted)]">
                            {course.completedDate}
                          </span>
                        )}
                      </div>
                      <ProgressBar
                        value={course.progress}
                        size="sm"
                        variant={course.progress === 100 ? 'success' : 'primary'}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent>
                <h3 className="font-medium text-[var(--color-foreground)] mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button variant="secondary" fullWidth className="justify-start">
                    <BookOpen size={18} />
                    View All Courses
                  </Button>
                  <Button variant="secondary" fullWidth className="justify-start">
                    <Award size={18} />
                    View Certificates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
