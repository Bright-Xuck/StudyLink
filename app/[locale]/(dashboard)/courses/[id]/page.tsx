'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Avatar,
  ProgressBar,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui';
import {
  BookOpen,
  Users,
  Clock,
  Star,
  CheckCircle2,
  Play,
  Lock,
  ChevronDown,
  Award,
  FileText,
  MessageSquare,
} from 'lucide-react';

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations('courses');

  // Mock course data
  const course = {
    id,
    title: 'React Fundamentals',
    description:
      'Master React fundamentals through interactive lessons, real-world examples, and hands-on projects. Build modern, responsive web applications with confidence.',
    instructor: {
      name: 'Sarah Johnson',
      avatar: null,
      title: 'Senior Frontend Developer',
      bio: '10+ years of experience building web applications at top tech companies.',
    },
    level: 'Beginner' as const,
    lessons: 24,
    students: 3200,
    rating: 4.8,
    reviews: 1250,
    duration: '8 hours',
    enrolled: true,
    progress: 65,
    chapters: [
      {
        id: 1,
        title: 'Getting Started with React',
        duration: '45 min',
        lessons: [
          { id: 1, title: 'Introduction to React', duration: '10 min', completed: true },
          { id: 2, title: 'Setting Up Your Environment', duration: '15 min', completed: true },
          { id: 3, title: 'Your First React App', duration: '20 min', completed: true },
        ],
      },
      {
        id: 2,
        title: 'Components & Props',
        duration: '1 hr 15 min',
        lessons: [
          { id: 4, title: 'Understanding Components', duration: '15 min', completed: true },
          { id: 5, title: 'Props and Data Flow', duration: '20 min', completed: true },
          { id: 6, title: 'Component Composition', duration: '20 min', completed: false },
          { id: 7, title: 'Practical Exercise', duration: '20 min', completed: false },
        ],
      },
      {
        id: 3,
        title: 'State Management',
        duration: '1 hr 30 min',
        lessons: [
          { id: 8, title: 'useState Hook', duration: '20 min', completed: false },
          { id: 9, title: 'useEffect Hook', duration: '25 min', completed: false },
          { id: 10, title: 'useContext Hook', duration: '25 min', completed: false },
          { id: 11, title: 'Building a Todo App', duration: '20 min', completed: false },
        ],
      },
      {
        id: 4,
        title: 'Advanced Patterns',
        duration: '2 hr',
        lessons: [
          { id: 12, title: 'Custom Hooks', duration: '30 min', completed: false },
          { id: 13, title: 'Performance Optimization', duration: '30 min', completed: false },
          { id: 14, title: 'Error Boundaries', duration: '30 min', completed: false },
          { id: 15, title: 'Final Project', duration: '30 min', completed: false },
        ],
      },
    ],
    whatYouLearn: [
      'Build modern React applications from scratch',
      'Understand component-based architecture',
      'Manage state effectively with hooks',
      'Implement best practices and patterns',
      'Create reusable and maintainable code',
      'Deploy React applications to production',
    ],
    requirements: [
      'Basic knowledge of HTML, CSS, and JavaScript',
      'A computer with a code editor installed',
      'Eagerness to learn and build projects',
    ],
    reviewsList: [
      {
        id: 1,
        user: 'Michael K.',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Excellent course! Sarah explains concepts clearly and the projects are very practical.',
      },
      {
        id: 2,
        user: 'Emma L.',
        rating: 5,
        date: '1 month ago',
        comment: 'Best React course I have taken. The hands-on approach really helps solidify the concepts.',
      },
      {
        id: 3,
        user: 'James W.',
        rating: 4,
        date: '1 month ago',
        comment: 'Great content overall. Would love more advanced topics in a follow-up course.',
      },
    ],
  };

  const levelVariant = {
    Beginner: 'success',
    Intermediate: 'warning',
    Advanced: 'error',
  } as const;

  const completedLessons = course.chapters.reduce(
    (acc, ch) => acc + ch.lessons.filter((l) => l.completed).length,
    0
  );
  const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="p-6 lg:p-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            {/* Course Thumbnail */}
            <div className="hidden md:flex w-48 h-32 rounded-[var(--radius-lg)] bg-[var(--color-primary)] items-center justify-center shrink-0">
              <BookOpen size={48} className="text-[var(--color-primary-foreground)] opacity-30" />
            </div>

            {/* Course Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={levelVariant[course.level]} size="sm">
                  {course.level}
                </Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Star size={14} className="text-[var(--color-accent)] fill-[var(--color-accent)]" />
                  <span className="font-medium text-[var(--color-foreground)]">{course.rating}</span>
                  <span className="text-[var(--color-foreground-muted)]">
                    ({course.reviews.toLocaleString()} reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-2xl font-semibold text-[var(--color-foreground)] mb-2">
                {course.title}
              </h1>

              <p className="text-[var(--color-foreground-muted)] mb-4 max-w-2xl">
                {course.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-foreground-muted)]">
                <span className="flex items-center gap-1">
                  <BookOpen size={16} />
                  {course.lessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={16} />
                  {course.students.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1">
                  <Award size={16} />
                  Certificate included
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar (if enrolled) */}
          {course.enrolled && (
            <Card className="mt-6">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--color-foreground)]">
                    Your Progress
                  </span>
                  <span className="text-sm text-[var(--color-foreground-muted)]">
                    {completedLessons} of {totalLessons} lessons completed
                  </span>
                </div>
                <ProgressBar value={course.progress} size="md" />
                <div className="mt-4 flex gap-3">
                  <Button variant="primary" icon={<Play size={16} />}>
                    Continue Learning
                  </Button>
                  <Button variant="secondary">View Certificate</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="curriculum" className="space-y-6">
          <TabsList>
            <TabsTrigger value="curriculum">{t('curriculum')}</TabsTrigger>
            <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('reviews')}</TabsTrigger>
          </TabsList>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Chapters List */}
              <div className="lg:col-span-2 space-y-4">
                {course.chapters.map((chapter, chapterIndex) => (
                  <Card key={chapter.id} padding="none">
                    {/* Chapter Header */}
                    <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-[var(--color-foreground)]">
                          Chapter {chapterIndex + 1}: {chapter.title}
                        </h3>
                        <p className="text-sm text-[var(--color-foreground-muted)]">
                          {chapter.lessons.length} lessons - {chapter.duration}
                        </p>
                      </div>
                      <ChevronDown size={20} className="text-[var(--color-foreground-muted)]" />
                    </div>

                    {/* Lessons List */}
                    <div className="divide-y divide-[var(--color-border)]">
                      {chapter.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-4 p-4 hover:bg-[var(--color-background)] transition-colors"
                        >
                          {/* Status Icon */}
                          <div className="shrink-0">
                            {lesson.completed ? (
                              <CheckCircle2
                                size={20}
                                className="text-[var(--color-success)]"
                              />
                            ) : course.enrolled ? (
                              <Play
                                size={20}
                                className="text-[var(--color-primary)]"
                              />
                            ) : (
                              <Lock
                                size={20}
                                className="text-[var(--color-foreground-subtle)]"
                              />
                            )}
                          </div>

                          {/* Lesson Info */}
                          <div className="flex-1">
                            <p
                              className={`text-sm ${
                                lesson.completed
                                  ? 'text-[var(--color-foreground-muted)]'
                                  : 'text-[var(--color-foreground)]'
                              }`}
                            >
                              {lesson.title}
                            </p>
                          </div>

                          {/* Duration */}
                          <span className="text-xs text-[var(--color-foreground-muted)]">
                            {lesson.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Instructor Card */}
                <Card>
                  <CardContent>
                    <h3 className="font-medium text-[var(--color-foreground)] mb-4">
                      {t('instructor')}
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar name={course.instructor.name} size="lg" />
                      <div>
                        <p className="font-medium text-[var(--color-foreground)]">
                          {course.instructor.name}
                        </p>
                        <p className="text-sm text-[var(--color-foreground-muted)]">
                          {course.instructor.title}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--color-foreground-muted)]">
                      {course.instructor.bio}
                    </p>
                  </CardContent>
                </Card>

                {/* Enroll Card (if not enrolled) */}
                {!course.enrolled && (
                  <Card className="border-2 border-[var(--color-primary)]">
                    <CardContent>
                      <p className="text-2xl font-semibold text-[var(--color-foreground)] mb-4">
                        Free
                      </p>
                      <Button variant="primary" fullWidth size="lg" className="mb-3">
                        Enroll Now
                      </Button>
                      <p className="text-xs text-center text-[var(--color-foreground-muted)]">
                        Full lifetime access
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* What You Will Learn */}
                <Card>
                  <CardContent>
                    <h3 className="font-medium text-[var(--color-foreground)] mb-4">
                      {t('what_learn')}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {course.whatYouLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2
                            size={16}
                            className="text-[var(--color-success)] shrink-0 mt-0.5"
                          />
                          <span className="text-sm text-[var(--color-foreground-muted)]">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardContent>
                    <h3 className="font-medium text-[var(--color-foreground)] mb-4">
                      {t('requirements')}
                    </h3>
                    <ul className="space-y-2">
                      {course.requirements.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-[var(--color-foreground-muted)]"
                        >
                          <span className="text-[var(--color-foreground)]">-</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div>
                <Card>
                  <CardContent>
                    <h3 className="font-medium text-[var(--color-foreground)] mb-4">
                      Course Includes
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm text-[var(--color-foreground-muted)]">
                        <Play size={16} className="text-[var(--color-primary)]" />
                        {course.duration} of video content
                      </li>
                      <li className="flex items-center gap-3 text-sm text-[var(--color-foreground-muted)]">
                        <FileText size={16} className="text-[var(--color-primary)]" />
                        {course.lessons} lessons
                      </li>
                      <li className="flex items-center gap-3 text-sm text-[var(--color-foreground-muted)]">
                        <Award size={16} className="text-[var(--color-primary)]" />
                        Certificate of completion
                      </li>
                      <li className="flex items-center gap-3 text-sm text-[var(--color-foreground-muted)]">
                        <MessageSquare size={16} className="text-[var(--color-primary)]" />
                        Community access
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {course.reviewsList.map((review) => (
                  <Card key={review.id}>
                    <CardContent>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={review.user} size="md" />
                          <div>
                            <p className="font-medium text-[var(--color-foreground)]">
                              {review.user}
                            </p>
                            <p className="text-xs text-[var(--color-foreground-muted)]">
                              {review.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className="text-[var(--color-accent)] fill-[var(--color-accent)]"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[var(--color-foreground-muted)]">
                        {review.comment}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Rating Summary */}
              <div>
                <Card>
                  <CardContent className="text-center">
                    <p className="text-4xl font-semibold text-[var(--color-foreground)] mb-1">
                      {course.rating}
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(course.rating)
                              ? 'text-[var(--color-accent)] fill-[var(--color-accent)]'
                              : 'text-[var(--color-foreground-subtle)]'
                          }
                        />
                      ))}
                    </div>
                    <p className="text-sm text-[var(--color-foreground-muted)]">
                      Based on {course.reviews.toLocaleString()} reviews
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
