'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { requestPasswordReset } from '@/lib/actions/auth.actions';
import { GraduationCap, Loader2, Mail, ArrowLeft } from 'lucide-react';
import { Link } from "@/i18n/navigation";

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const tp = useTranslations('password');
  const params = useParams();
  const locale = params.locale as string;

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await requestPasswordReset({ email }, locale);

      if (result.success) {
        setIsSuccess(true);
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
            <span className="text-2xl font-bold text-foreground">ResearchEthics</span>
          </Link>
          <h2 className="text-3xl font-bold text-foreground">
            {tp('forgotTitle')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {tp('forgotSubtitle')}
          </p>
        </div>

        {/* Form or Success Message */}
        <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="bg-accent/20 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Mail className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {tp('emailSent')}
              </h3>
              <p className="text-muted-foreground">
                {tp('emailSentMessage')}
              </p>
              <p className="text-sm text-muted-foreground">
                {tp('checkSpam')}
              </p>
              <Link
                href={`/login`}
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                {tp('backToLogin')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nkengbeza123@gmail.com"
                  className="mt-1"
                />
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
                    {tp('sending')}
                  </>
                ) : (
                  tp('sendResetLink')
                )}
              </Button>

              <div className="text-center">
                <Link
                  href={`/login`}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
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