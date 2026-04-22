'use client';

import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const [formData, setFormData] = useState({ name: '', email: '' });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
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
      <Footer />
    </div>
  );
}
