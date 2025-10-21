'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPassword } from '@/lib/actions/auth.actions';
import { GraduationCap, Loader2, CheckCircle } from 'lucide-react';
import { Link, useRouter } from "@/i18n/navigation";

export default function ResetPasswordPage() {
  const t = useTranslations('auth');
  const tp = useTranslations('password');
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError(tp('invalidLink'));
    }
  }, [searchParams, tp]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setValidationError('');

    // Validate passwords
    if (formData.password.length < 6) {
      setValidationError(tp('passwordMin'));
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError(tp('passwordMismatch'));
      setIsLoading(false);
      return;
    }

    try {
      const result = await resetPassword(token, formData.password, locale);

      if (result.success) {
        setIsSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push(`/login`);
        }, 3000);
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (error) {
      console.error(error)
      setError('An unexpected error occurred');
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
            <span className="text-2xl font-bold text-foreground">ZenithScholar</span>
          </Link>
          <h2 className="text-3xl font-bold text-foreground">
            {tp('resetTitle')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {tp('resetSubtitle')}
          </p>
        </div>

        {/* Form or Success Message */}
        <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="bg-accent/20 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {tp('success')}
              </h3>
              <p className="text-muted-foreground">
                {tp('successMessage')}
              </p>
              <p className="text-sm text-muted-foreground">
                {tp('redirecting')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {validationError && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                  {validationError}
                </div>
              )}

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
                  disabled={!token}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="mt-1"
                  disabled={!token}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading || !token}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {tp('resetting')}
                  </>
                ) : (
                  tp('resetButton')
                )}
              </Button>

              <div className="text-center">
                <Link
                  href={`/login`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {tp('backToLogin')}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}