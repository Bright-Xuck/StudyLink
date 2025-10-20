import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getModuleBySlug } from '@/lib/actions/module.actions';
import { getAuthenticatedUser } from '@/lib/actions/auth.actions';
import { getModuleQuizzes } from '@/lib/actions/quiz.actions';
import { getModuleProgress } from '@/lib/actions/progress.actions';
import QuizInterface from '@/components/modules/QuizInterface';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Award } from 'lucide-react';

type QuizPageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

interface Quiz {
  _id: {
    toString(): string;
  };
  title: string;
  questions: unknown[];
  passingScore: number;
  timeLimit?: number;
  maxAttempts?: number;
}

interface QuizAttempt {
  quizId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
}

interface Progress {
  quizAttempts?: QuizAttempt[];
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { slug } = await params;

  if (!slug) {
    return notFound();
  }

  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(`/login?redirect=/modules/${slug}/quiz`);
  }

  const t = await getTranslations('quiz');
  const courseModule = await getModuleBySlug(slug);

  if (!courseModule) {
    return notFound();
  }

  // Check if user has access
  const hasAccess =
    courseModule.isFree ||
    user.purchasedModules.includes(courseModule._id);

  if (!hasAccess) {
    redirect(`/modules/${slug}`);
  }

  // Get quizzes for this module
  const quizzes = (await getModuleQuizzes(courseModule._id)) as Quiz[];

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          {/* Back Button */}
          <Link
            href={`/modules/${slug}`}
            className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToModule')}
          </Link>

          {/* No Quiz State */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t('noQuizAvailable')}
              </h1>
              <p className="text-muted-foreground mb-6">
                {t('noQuizMessage')}
              </p>
              <Link
                href={`/modules/${slug}`}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                {t('returnToModule')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get progress to check quiz status
  const progress = (await getModuleProgress(courseModule._id)) as Progress | null;

  // For now, get the first quiz (you can expand to handle multiple quizzes)
  const quiz = quizzes[0];

  // Find best attempt for this quiz
  const bestAttempt = progress?.quizAttempts?.find(
    (attempt: QuizAttempt) => attempt.quizId === quiz._id.toString()
  );

  const hasPassed = bestAttempt?.passed || false;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Link
            href={`/modules/${slug}`}
            className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToModule')}
          </Link>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {courseModule.title}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {t('moduleQuiz')}
                </p>

                {/* Quiz Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-foreground">
                      {quiz.questions?.length || 0} {t('questions')}
                    </span>
                  </div>
                  {quiz.timeLimit && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-foreground">
                        {quiz.timeLimit} {t('minutes')}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-foreground">
                      {t('passingScore')}: {quiz.passingScore}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Pass Status Badge */}
              {hasPassed && (
                <div className="flex-shrink-0">
                  <div className="bg-accent/20 border border-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {t('quizPassed')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Instructions */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-muted border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {t('instructions')}
            </h2>
            <ul className="space-y-2 text-foreground/90">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  {t('instruction1', { 
                    count: quiz.questions?.length || 0,
                    score: quiz.passingScore 
                  })}
                </span>
              </li>
              {quiz.timeLimit && (
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{t('instruction2', { time: quiz.timeLimit })}</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{t('instruction3')}</span>
              </li>
              {quiz.maxAttempts && (
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    {t('instruction4', { attempts: quiz.maxAttempts })}
                  </span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{t('instruction5')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Previous Attempts Summary */}
        {bestAttempt && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {t('yourBestScore')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    {bestAttempt.percentage}%
                  </p>
                  <p className="text-sm text-muted-foreground">{t('score')}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {bestAttempt.score}/{bestAttempt.totalPoints}
                  </p>
                  <p className="text-sm text-muted-foreground">{t('points')}</p>
                </div>
                <div className="text-center">
                  <p
                    className={`text-3xl font-bold ${
                      bestAttempt.passed ? 'text-accent' : 'text-destructive'
                    }`}
                  >
                    {bestAttempt.passed ? '✓' : '✗'}
                  </p>
                  <p className="text-sm text-muted-foreground">{t('status')}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {progress?.quizAttempts?.filter(
                      (a: QuizAttempt) => a.quizId === quiz._id.toString()
                    ).length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">{t('attempts')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Taking Interface */}
        <div className="max-w-4xl mx-auto">
          <QuizInterface
            quizId={quiz._id.toString()}
            moduleSlug={slug}
            canAttempt={
              !quiz.maxAttempts ||
              (progress?.quizAttempts?.filter(
                (a: QuizAttempt) => a.quizId === quiz._id.toString()
              ).length || 0) < quiz.maxAttempts
            }
            attemptsRemaining={
              quiz.maxAttempts
                ? quiz.maxAttempts -
                  (progress?.quizAttempts?.filter(
                    (a: QuizAttempt) => a.quizId === quiz._id.toString()
                  ).length || 0)
                : null
            }
          />
        </div>
      </div>
    </div>
  );
}