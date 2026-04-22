'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Input, Button } from '@/components/ui';
import { Mail, Lock, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Connect to backend API
    console.log('Login attempt:', { email, password, rememberMe });
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="w-full">
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-[var(--radius)] bg-[var(--color-primary)] flex items-center justify-center">
          <GraduationCap size={28} className="text-[var(--color-primary-foreground)]" />
        </div>
        <span className="text-2xl font-semibold text-[var(--color-foreground)]">StudyLink</span>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-foreground)] mb-2">
          {t('login_title')}
        </h1>
        <p className="text-[var(--color-foreground-muted)]">
          {t('login_subtitle')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label={t('email')}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={18} />}
          required
        />

        <Input
          label={t('password')}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={18} />}
          required
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <span className="text-sm text-[var(--color-foreground-muted)]">
              {t('remember_me')}
            </span>
          </label>

          <Link
            href="/auth/forgot-password"
            className="text-sm text-[var(--color-primary)] hover:underline"
          >
            {t('forgot_password')}
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : t('login_btn')}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--color-border)]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[var(--color-background)] text-[var(--color-foreground-muted)]">
            {t('or_continue')}
          </span>
        </div>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" type="button" className="gap-2">
          <GoogleIcon />
          Google
        </Button>
        <Button variant="secondary" type="button" className="gap-2">
          <GitHubIcon />
          GitHub
        </Button>
      </div>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-[var(--color-foreground-muted)] mt-8">
        {t('no_account')}{' '}
        <Link
          href="/auth/register"
          className="text-[var(--color-primary)] hover:underline font-medium"
        >
          {t('sign_up_link')}
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
