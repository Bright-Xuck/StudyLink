'use client';

import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const t = useTranslations('profile');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <Button variant="primary">{t('edit')}</Button>
          </div>

          {/* Profile Info */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-accent)]">12</p>
                    <p className="text-sm text-[var(--color-foreground-muted)]">{t('completed_courses')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-accent)]">156</p>
                    <p className="text-sm text-[var(--color-foreground-muted)]">{t('total_hours')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-accent)]">42</p>
                    <p className="text-sm text-[var(--color-foreground-muted)]">{t('current_streak')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t('achievements')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {['🎓', '🔥', '⭐', '🎯', '🚀', '💡'].map((emoji, i) => (
                    <div key={i} className="text-center p-4 bg-[var(--color-background-alt)] rounded-lg">
                      <p className="text-2xl mb-2">{emoji}</p>
                      <p className="text-xs text-[var(--color-foreground-muted)]">Achievement {i + 1}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
