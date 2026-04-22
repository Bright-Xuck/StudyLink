'use client';

import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { GroupCard } from '@/components/features/GroupCard';

const mockGroups = [
  { id: '1', name: 'React Learners', description: 'Group for React enthusiasts', members: 145, subject: 'React' },
  { id: '2', name: 'Node.js Masters', description: 'Advanced Node.js discussions', members: 89, subject: 'Backend' },
  { id: '3', name: 'Web Dev Bootcamp', description: 'Full stack web development', members: 234, subject: 'Full Stack' },
  { id: '4', name: 'TypeScript Pro', description: 'TypeScript best practices', members: 67, subject: 'TypeScript' },
];

export default function GroupsPage() {
  const t = useTranslations('groups');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
              <p className="text-slate-300">{t('subtitle')}</p>
            </div>
            <Button variant="primary" size="lg">
              {t('create')}
            </Button>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockGroups.map((group) => (
              <GroupCard
                key={group.id}
                {...group}
                onJoin={() => console.log('Join', group.name)}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
