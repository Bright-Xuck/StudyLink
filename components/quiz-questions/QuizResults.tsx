// ============================================
// components/quiz/QuizResults.tsx
// ============================================
'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Question {
  _id: string;
  type: string;
  questionText: string;
  options?: string[];
}

interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
  passingScore: number;
}

interface QuestionResult {
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  pointsAwarded: number;
  pointsPossible: number;
}

interface Results {
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  answers: QuestionResult[];
}

interface QuizResultsProps {
  results: Results;
  quiz: Quiz;
  onClose: () => void;
  onQuizPassed?: () => void;
}

export default function QuizResults({ results, quiz, onClose, onQuizPassed }: QuizResultsProps) {
  const t = useTranslations('quiz');
  const { score, totalPoints, percentage, passed, answers } = results;

  // Count correct/incorrect
  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalQuestions = answers.length;

  // Determine performance message and styling
  const getPerformance = () => {
    if (percentage >= 90) return { 
      text: t('outstanding'), 
      color: 'text-accent-foreground',
      bgColor: 'bg-accent/20',
      borderColor: 'border-accent',
      icon: '🏆'
    };
    if (percentage >= 75) return { 
      text: t('greatJob'), 
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary',
      icon: '⭐'
    };
    if (percentage >= 60) return { 
      text: t('goodEffort'), 
      color: 'text-secondary-foreground',
      bgColor: 'bg-secondary/20',
      borderColor: 'border-secondary',
      icon: '✓'
    };
    return { 
      text: t('keepPracticing'), 
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive',
      icon: '📚'
    };
  };

  const performance = getPerformance();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card rounded-xl shadow-2xl max-w-4xl w-full my-8 border border-border">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6 rounded-t-xl">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{t('quizComplete')} 🎊</h2>
              <p className="text-lg opacity-90">{quiz.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-primary-foreground hover:text-primary-foreground/80 transition-colors ml-4"
              aria-label={t('closeResults')}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Score Summary */}
        <div className={`p-8 border-b-4 ${performance.borderColor} ${performance.bgColor}`}>
          <div className="text-center">
            <div className="text-6xl mb-3">{performance.icon}</div>
            <h3 className={`text-3xl font-bold mb-4 ${performance.color}`}>
              {performance.text}
            </h3>
            
            {/* Score Circle */}
            <div className="flex justify-center items-center mb-6">
              <div className="relative inline-flex items-center justify-center w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentage / 100)}`}
                    className={percentage >= quiz.passingScore ? 'text-accent' : 'text-secondary'}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute">
                  <div className="text-5xl font-bold text-foreground">{percentage}%</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
                <p className="text-3xl font-bold text-foreground">{score}</p>
                <p className="text-sm text-muted-foreground">{t('pointsEarned')}</p>
              </div>
              <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
                <p className="text-3xl font-bold text-foreground">{totalPoints}</p>
                <p className="text-sm text-muted-foreground">{t('totalPoints')}</p>
              </div>
              <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
                <p className="text-3xl font-bold text-accent-foreground">{correctCount}</p>
                <p className="text-sm text-muted-foreground">{t('correct')}</p>
              </div>
              <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
                <p className="text-3xl font-bold text-destructive">{totalQuestions - correctCount}</p>
                <p className="text-sm text-muted-foreground">{t('incorrect')}</p>
              </div>
            </div>

            {/* Pass/Fail Badge */}
            <div className="mt-6">
              {passed ? (
                <span className="inline-block px-6 py-2 bg-accent/20 text-accent-foreground rounded-full font-semibold text-lg border border-accent">
                  ✓ {t('passed')}
                </span>
              ) : (
                <span className="inline-block px-6 py-2 bg-secondary/20 text-secondary-foreground rounded-full font-semibold text-lg border border-secondary">
                  {t('reviewAndRetry')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="p-6 max-h-[500px] overflow-y-auto">
          <h3 className="text-2xl font-semibold mb-6 text-foreground flex items-center">
            <span className="mr-2">📋</span>
            {t('reviewAnswers')}
          </h3>
          
          <div className="space-y-6">
            {answers.map((result, index) => {
              return (
                <div
                  key={result.questionId}
                  className={`p-5 rounded-xl border-2 ${
                    result.isCorrect
                      ? 'border-accent bg-accent/5'
                      : 'border-destructive bg-destructive/5'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-foreground text-lg flex items-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm mr-3">
                        {index + 1}
                      </span>
                      {t('questionNumber', { number: index + 1 })}
                    </h4>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                        result.isCorrect
                          ? 'bg-accent/20 text-accent-foreground border border-accent'
                          : 'bg-destructive/20 text-destructive border border-destructive'
                      }`}
                    >
                      {result.isCorrect ? `✓ ${t('correct')}` : `✗ ${t('incorrect')}`}
                    </span>
                  </div>

                  {/* Question Text */}
                  <p className="text-foreground font-medium mb-4 text-base leading-relaxed">
                    {result.questionText}
                  </p>

                  {/* Answers */}
                  <div className="space-y-3">
                    {/* Your Answer */}
                    <div className="bg-card/60 p-3 rounded-lg border border-border">
                      <span className="font-semibold text-foreground block mb-1">{t('yourAnswer')}:</span>
                      <span className={`${result.isCorrect ? 'text-accent-foreground' : 'text-destructive'} font-medium`}>
                        {result.userAnswer || `(${t('noAnswer')})`}
                      </span>
                    </div>

                    {/* Correct Answer (if incorrect) */}
                    {!result.isCorrect && (
                      <div className="bg-card/60 p-3 rounded-lg border border-border">
                        <span className="font-semibold text-foreground block mb-1">{t('correctAnswer')}:</span>
                        <span className="text-accent-foreground font-medium">
                          {result.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Points */}
                  <div className="mt-3 text-sm font-medium text-muted-foreground">
                    {t('pointsAwarded', { earned: result.pointsAwarded, total: result.pointsPossible })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-muted rounded-b-xl border-t border-border">
          <div className="flex justify-center gap-4">
            {passed && onQuizPassed && (
              <Button onClick={onQuizPassed} size="lg" className="bg-accent text-accent-foreground hover:opacity-90">
                {t('continueToNextLesson')}
              </Button>
            )}
            <Button onClick={onClose} size="lg" variant="outline">
              {t('closeAndReturn')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}