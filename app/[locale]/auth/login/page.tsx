'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Input, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useState } from 'react';

export default function LoginPage() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend API
    console.log('Login attempt:', { email, password, rememberMe });
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('login_title')}</CardTitle>
            <p className="text-sm text-[var(--color-foreground-muted)] mt-2">
              {t('login_subtitle')}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t('email')}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label={t('password')}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border border-[var(--color-border)]"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-[var(--color-foreground-muted)]">
                  {t('remember_me')}
                </label>
              </div>
              <Button type="submit" variant="primary" size="md" className="w-full">
                {t('login_btn')}
              </Button>
            </form>

            <p className="text-center text-sm text-[var(--color-foreground-muted)] mt-6">
              {t('no_account')}{' '}
              <Link href="/auth/register" className="text-[var(--color-accent)] hover:underline font-medium">
                {t('sign_up_link')}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
