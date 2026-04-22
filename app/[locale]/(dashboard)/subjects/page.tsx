'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import {
  Code,
  Smartphone,
  Database,
  Cloud,
  Brain,
  Gamepad2,
  Palette,
  Shield,
  ArrowRight,
} from 'lucide-react';

const mockSubjects = [
  {
    id: '1',
    name: 'Web Development',
    description: 'Build modern websites and web applications',
    courses: 12,
    students: 5000,
    icon: Code,
    color: '#3b82f6',
    bgColor: '#dbeafe',
  },
  {
    id: '2',
    name: 'Mobile Development',
    description: 'Create iOS and Android applications',
    courses: 8,
    students: 3200,
    icon: Smartphone,
    color: '#8b5cf6',
    bgColor: '#ede9fe',
  },
  {
    id: '3',
    name: 'Data Science',
    description: 'Analyze and visualize complex data sets',
    courses: 10,
    students: 4100,
    icon: Database,
    color: '#10b981',
    bgColor: '#d1fae5',
  },
  {
    id: '4',
    name: 'Cloud & DevOps',
    description: 'Deploy and manage cloud infrastructure',
    courses: 7,
    students: 2800,
    icon: Cloud,
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
  {
    id: '5',
    name: 'AI & Machine Learning',
    description: 'Build intelligent systems and models',
    courses: 9,
    students: 3500,
    icon: Brain,
    color: '#ec4899',
    bgColor: '#fce7f3',
  },
  {
    id: '6',
    name: 'Game Development',
    description: 'Design and develop interactive games',
    courses: 6,
    students: 2100,
    icon: Gamepad2,
    color: '#ef4444',
    bgColor: '#fee2e2',
  },
  {
    id: '7',
    name: 'UI/UX Design',
    description: 'Create beautiful user interfaces and experiences',
    courses: 8,
    students: 2900,
    icon: Palette,
    color: '#06b6d4',
    bgColor: '#cffafe',
  },
  {
    id: '8',
    name: 'Cybersecurity',
    description: 'Protect systems and data from threats',
    courses: 5,
    students: 1800,
    icon: Shield,
    color: '#64748b',
    bgColor: '#f1f5f9',
  },
];

export default function SubjectsPage() {
  const t = useTranslations('subjects');

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

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockSubjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <Card key={subject.id} hover className="group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-[var(--radius)] flex items-center justify-center shrink-0"
                      style={{ backgroundColor: subject.bgColor, color: subject.color }}
                    >
                      <Icon size={24} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-[var(--color-foreground)] text-lg mb-1">
                        {subject.name}
                      </h2>
                      <p className="text-sm text-[var(--color-foreground-muted)] mb-4 line-clamp-2">
                        {subject.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[var(--color-foreground)]">
                          <span className="font-medium">{subject.courses}</span>{' '}
                          <span className="text-[var(--color-foreground-muted)]">
                            {t('courses')}
                          </span>
                        </span>
                        <span className="text-[var(--color-foreground-muted)]">
                          {subject.students.toLocaleString()} students
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Explore Button */}
                  <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
                    <Link
                      href={`/courses?subject=${subject.id}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline group-hover:gap-3 transition-all"
                    >
                      {t('explore')}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
