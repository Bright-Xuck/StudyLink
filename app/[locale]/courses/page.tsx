'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input, Badge } from '@/components/ui';
import { CourseCard } from '@/components/features/CourseCard';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  students: number;
  subject: string;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React and build interactive UIs',
    instructor: 'Sarah Johnson',
    level: 'Beginner',
    lessons: 24,
    students: 3200,
    subject: 'Frontend',
  },
  {
    id: '2',
    title: 'Advanced Node.js',
    description: 'Master backend development with Node.js and Express',
    instructor: 'Mike Chen',
    level: 'Advanced',
    lessons: 32,
    students: 1800,
    subject: 'Backend',
  },
  {
    id: '3',
    title: 'TypeScript Essentials',
    description: 'Write type-safe JavaScript with TypeScript',
    instructor: 'Alex Rodriguez',
    level: 'Intermediate',
    lessons: 18,
    students: 2500,
    subject: 'Programming',
  },
  {
    id: '4',
    title: 'Full Stack Web Development',
    description: 'Build complete web applications from scratch',
    instructor: 'Emma Wilson',
    level: 'Intermediate',
    lessons: 48,
    students: 4100,
    subject: 'Full Stack',
  },
];

export default function CoursesPage() {
  const t = useTranslations('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = ['all', 'Frontend', 'Backend', 'Full Stack', 'Programming'];

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <main>
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-slate-300">{t('subtitle')}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Input
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

          {/* Subject Filter */}
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSubject === subject
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-background-alt)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]'
                }`}
              >
                {subject === 'all' ? t('filter_all') : subject}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              {...course}
              onEnroll={() => console.log('Enroll in', course.title)}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--color-foreground-muted)]">
              No courses found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
