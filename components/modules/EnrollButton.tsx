'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { CheckCircle, Lock, Loader2 } from 'lucide-react';
import { enrollFreeModule } from '@/lib/actions/enrollment.actions';

interface EnrollButtonProps {
  moduleId: string;
  moduleSlug: string;
  isFree: boolean;
  hasAccess: boolean;
  isAuthenticated: boolean;
}

export default function EnrollButton({
  moduleId,
  moduleSlug,
  isFree,
  hasAccess,
  isAuthenticated,
}: EnrollButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('enrollment');

  const handleEnroll = async () => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(`/login?redirect=/modules/${moduleId}`);
      return;
    }

    // If already has access, scroll to content
    if (hasAccess) {
      const contentSection = document.getElementById('module-content');
      contentSection?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsLoading(true);

    try {
      if (isFree) {
        // For free modules, enroll directly
        const response = await enrollFreeModule(moduleId);
        
        if (response.success) {
          router.refresh(); // Refresh to show access
        } else {
          console.error(response.error);
        }
      } else {
        // For paid modules, redirect to checkout
        router.push(`/payment/checkout?module=${moduleSlug}`);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Already enrolled
  if (hasAccess) {
    return (
      <Button size="lg" className="w-full" variant="secondary" disabled>
        <CheckCircle className="mr-2 h-5 w-5" />
        {t('alreadyEnrolled')}
      </Button>
    );
  }

  // Free module
  if (isFree) {
    return (
      <Button size="lg" className="w-full" onClick={handleEnroll} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t('enrolling')}
          </>
        ) : (
          t('enrollFree')
        )}
      </Button>
    );
  }

  // Paid module
  return (
    <Button size="lg" className="w-full" onClick={handleEnroll} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {t('loading')}
        </>
      ) : (
        <>
          <Lock className="mr-2 h-5 w-5" />
          {t('buyNow')}
        </>
      )}
    </Button>
  );

}