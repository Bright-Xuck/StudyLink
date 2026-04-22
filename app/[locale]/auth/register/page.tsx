'use client';

import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration attempt:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t('register_title')}</CardTitle>
              <p className="text-sm text-[var(--color-foreground-muted)] mt-2">
                {t('register_subtitle')}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('first_name')}
                    placeholder="John"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label={t('last_name')}
                    placeholder="Doe"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Input
                  label={t('email')}
                  type="email"
                  placeholder="you@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  label={t('password')}
                  type="password"
                  placeholder="••••••••"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Input
                  label={t('confirm_password')}
                  type="password"
                  placeholder="••••••••"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-[var(--color-foreground-muted)]">
                    {t('terms_agree')}
                  </label>
                </div>
                <Button type="submit" variant="primary" size="md" className="w-full">
                  {t('register_btn')}
                </Button>
              </form>

              <p className="text-center text-sm text-[var(--color-foreground-muted)] mt-6">
                {t('have_account')}{' '}
                <Link href="/auth/login" className="text-[var(--color-accent)] hover:underline font-medium">
                  {t('sign_in_link')}
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
