'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import QuizContainer from '@/components/quiz/QuizContainer';
import { Button } from '@/components/ui/button';
import { PlayCircle, AlertCircle } from 'lucide-react';

interface QuizInterfaceProps {
  quizId: string;
  moduleSlug: string;
  canAttempt: boolean;
  attemptsRemaining: number | null;
}

export default function QuizInterface({
  quizId,
  moduleSlug,
  canAttempt,
  attemptsRemaining,
}: QuizInterfaceProps) {
  const t = useTranslations('quiz');
  const router = useRouter();
  const [showQuiz, setShowQuiz] = useState(false);

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    // Refresh the page to show updated attempts
    router.refresh();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-8">
      {canAttempt ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {t('readyToStart')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('readyToStartMessage')}
          </p>

          {attemptsRemaining !== null && (
            <div className="mb-6 inline-block bg-muted px-4 py-2 rounded-lg">
              <p className="text-sm text-foreground">
                {t('attemptsRemaining')}: <span className="font-bold">{attemptsRemaining}</span>
              </p>
            </div>
          )}

          <Button
            size="lg"
            onClick={handleStartQuiz}
            className="min-w-[200px]"
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            {t('startQuiz')}
          </Button>

          {showQuiz && (
            <QuizContainer quizId={quizId} onClose={handleCloseQuiz} />
          )}
        </div>
      ) : (
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t('maxAttemptsReached')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('maxAttemptsReachedMessage')}
          </p>
          <Button
            variant="outline"
            onClick={() => router.push(`/modules/${moduleSlug}`)}
          >
            {t('returnToModule')}
          </Button>
        </div>
      )}
    </div>
  );
}