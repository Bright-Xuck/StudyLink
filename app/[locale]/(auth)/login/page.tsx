'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginUser } from '@/lib/actions/auth.actions';
import { GraduationCap, Loader2 } from 'lucide-react';
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/contexts/AuthProvider";

export default function LoginPage() {
  const t = useTranslations('auth');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError('');
    setErrors({});

    try {
      const result = await loginUser(formData, locale);

      if (result.success) {
        await refreshUser()
        // Redirect based on role
        if (result.user?.role === 'admin') {
          router.push(`/admin`);
        } else {
          router.push(`/dashboard`);
        }
      } else {
        setServerError(result.error || 'An error occurred');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)
      setServerError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href={`/`} className="inline-flex items-center justify-center space-x-2 mb-6">
            <GraduationCap className="h-12 w-12 text-primary" />
            <span className="text-2xl font-bold text-foreground">ResearchEthics</span>
          </Link>
          <h2 className="text-3xl font-bold text-foreground">{t('loginTitle')}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('noAccount')}{' '}
            <Link href={`/register`} className="text-primary hover:underline font-medium">
              {t('signUp')}
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 bg-card p-8 rounded-xl shadow-sm border border-border" onSubmit={handleSubmit}>
          {serverError && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
              {serverError}
            </div>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="mt-1"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <Link
                href={`/forgot-password`}
                className="text-sm text-primary hover:underline"
              >
                {t('forgotPassword')}
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {locale === 'fr' ? 'Connexion...' : 'Logging in...'}
              </>
            ) : (
              t('loginButton')
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}