'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { enrollFreeCourse } from '@/lib/actions/enrollment.actions';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';

interface EnrollButtonProps {
  courseId: string;
  isFree: boolean;
  price: number;
  hasAccess: boolean;
  slug: string;
  fullWidth?: boolean;
}

export default function EnrollButton({
  courseId,
  isFree,
  price,
  hasAccess,
  slug,
  fullWidth = false,
}: EnrollButtonProps) {
  const t = useTranslations('CourseDetailPage');
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (isFree) {
      // Enroll in free course
      setIsEnrolling(true);
      try {
        const result = await enrollFreeCourse(courseId);
        
        if (result.success) {
          toast.success(result.message);
          router.refresh();
        } else {
          toast.error(result.error || 'Enrollment failed');
        }
      } catch (error) {
        console.error('Enrollment error:', error);
        toast.error('An error occurred');
      } finally {
        setIsEnrolling(false);
      }
    } else {
      // Redirect to payment page
      router.push(`/checkout/${courseId}`);
    }
  };

  // If user already has access
  if (hasAccess) {
    return (
      <Link href={`/courses/${slug}/learn`}>
        <Button 
          size="lg" 
          className={`gap-2 ${fullWidth ? 'w-full' : ''}`}
        >
          <CheckCircle className="w-5 h-5" />
          {t('buttons.continueLearning')}
        </Button>
      </Link>
    );
  }

  // Free course enrollment
  if (isFree) {
    return (
      <Button
        size="lg"
        onClick={handleEnroll}
        disabled={isEnrolling}
        className={`gap-2 ${fullWidth ? 'w-full' : ''}`}
      >
        {isEnrolling ? (
          <>
            <span className="animate-spin">⏳</span>
            {t('buttons.enrolling')}
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            {t('buttons.enrollFree')}
          </>
        )}
      </Button>
    );
  }

  // Paid course - go to payment
  return (
    <Button
      size="lg"
      onClick={handleEnroll}
      className={`gap-2 ${fullWidth ? 'w-full' : ''}`}
    >
      <ShoppingCart className="w-5 h-5" />
      {t('buttons.enrollNow')} - {price.toLocaleString()} XAF
    </Button>
  );
}