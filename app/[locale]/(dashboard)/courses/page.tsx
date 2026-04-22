'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, Input, Badge, Button } from '@/components/ui';
import { CourseCard } from '@/components/features/CourseCard';
import { Search, SlidersHorizontal, Grid3X3, List } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  students: number;
  duration: string;
  subject: string;
  enrolled?: boolean;
  progress?: number;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React and build interactive UIs with modern patterns',
    instructor: 'Sarah Johnson',
    level: 'Beginner',
    lessons: 24,
    students: 3200,
    duration: '8 hours',
    subject: 'Frontend',
    enrolled: true,
    progress: 65,
  },
  {
    id: '2',
    title: 'Advanced Node.js',
    description: 'Master backend development with Node.js, Express, and best practices',
    instructor: 'Mike Chen',
    level: 'Advanced',
    lessons: 32,
    students: 1800,
    duration: '12 hours',
    subject: 'Backend',
  },
  {
    id: '3',
    title: 'TypeScript Essentials',
    description: 'Write type-safe JavaScript with TypeScript for better code quality',
    instructor: 'Alex Rodriguez',
    level: 'Intermediate',
    lessons: 18,
    students: 2500,
    duration: '6 hours',
    subject: 'Programming',
  },
  {
    id: '4',
    title: 'Full Stack Web Development',
    description: 'Build complete web applications from scratch with modern technologies',
    instructor: 'Emma Wilson',
    level: 'Intermediate',
    lessons: 48,
    students: 4100,
    duration: '20 hours',
    subject: 'Full Stack',
    enrolled: true,
    progress: 25,
  },
  {
    id: '5',
    title: 'Python for Data Science',
    description: 'Learn Python programming for data analysis and visualization',
    instructor: 'David Park',
    level: 'Beginner',
    lessons: 30,
    students: 5200,
    duration: '10 hours',
    subject: 'Data Science',
  },
  {
    id: '6',
    title: 'AWS Cloud Practitioner',
    description: 'Get started with Amazon Web Services and cloud computing',
    instructor: 'Jennifer Lee',
    level: 'Beginner',
    lessons: 22,
    students: 2800,
    duration: '8 hours',
    subject: 'Cloud',
  },
];

const subjects = ['All', 'Frontend', 'Backend', 'Full Stack', 'Programming', 'Data Science', 'Cloud'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
  const t = useTranslations('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || course.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    return matchesSearch && matchesSubject && matchesLevel;
  });

  const enrolledCourses = filteredCourses.filter((c) => c.enrolled);
  const availableCourses = filteredCourses.filter((c) => !c.enrolled);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[var(--color-foreground)] mb-1">
            {t('title')}
          </h1>
          <p className="text-[var(--color-foreground-muted)]">
            {t('subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <div className="p-4 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]"
              />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Subject Filter */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`px-3 py-1.5 text-sm rounded-[var(--radius-sm)] transition-colors ${
                        selectedSubject === subject
                          ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                          : 'bg-[var(--color-background-alt)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
                      }`}
                    >
                      {subject === 'All' ? t('filter_all') : subject}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-[var(--color-background-alt)] rounded-[var(--radius-sm)] p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-[var(--radius-sm)] transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[var(--color-background-elevated)] text-[var(--color-foreground)] shadow-sm'
                      : 'text-[var(--color-foreground-muted)]'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-[var(--radius-sm)] transition-colors ${
                    viewMode === 'list'
                      ? 'bg-[var(--color-background-elevated)] text-[var(--color-foreground)] shadow-sm'
                      : 'text-[var(--color-foreground-muted)]'
                  }`}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Level Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-foreground-muted)]">Level:</span>
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedLevel === level
                      ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                      : 'bg-[var(--color-background-alt)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Enrolled Courses Section */}
        {enrolledCourses.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">
              {t('continue_learning')}
            </h2>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {enrolledCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  onEnroll={() => console.log('Continue:', course.title)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available Courses Section */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">
            All Courses
          </h2>
          {availableCourses.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {availableCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  onEnroll={() => console.log('Enroll in:', course.title)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <p className="text-[var(--color-foreground-muted)]">
                No courses found matching your criteria.
              </p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('All');
                  setSelectedLevel('All');
                }}
              >
                Clear Filters
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
