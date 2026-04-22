'use client';

import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const mockSubjects = [
  { id: '1', name: 'Web Development', courses: 12, students: 5000 },
  { id: '2', name: 'Mobile Development', courses: 8, students: 3200 },
  { id: '3', name: 'Data Science', courses: 10, students: 4100 },
  { id: '4', name: 'Cloud & DevOps', courses: 7, students: 2800 },
  { id: '5', name: 'AI & Machine Learning', courses: 9, students: 3500 },
  { id: '6', name: 'Game Development', courses: 6, students: 2100 },
];

export default function SubjectsPage() {
  const t = useTranslations('subjects');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
            <p className="text-slate-300">{t('subtitle')}</p>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSubjects.map((subject) => (
              <Card key={subject.id}>
                <CardHeader>
                  <CardTitle>{subject.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-[var(--color-foreground-muted)]">
                      {subject.courses} {t('courses')}
                    </p>
                    <p className="text-sm text-[var(--color-foreground-muted)]">
                      {subject.students} Students
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
