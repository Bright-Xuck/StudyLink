'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { getQuizById, submitQuizAttempt } from '@/lib/actions/quiz.actions';
import MCQQuestion from './MCQQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion';
import QuizResults from "./QuizResults";
import { Button } from '@/components/ui/button';
import { Loader2, X, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface Question {
  _id: string;
  type: 'mcq' | 'true-false' | 'short-answer';
  questionText: string;
  options?: string[];
  points: number;
  order: number;
}

interface Quiz {
  _id: string;
  title: string;
  lessonId: string;
  moduleId: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
}

interface QuizAttempt {
  _id: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  answers: {
    questionId: string;
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    pointsAwarded: number;
    pointsPossible: number;
  }[];
}

interface QuizContainerProps {
  quizId: string;
  courseId: string;
  moduleId: string;
  lessonOrder: number,
  onClose: () => void;
}

export default function QuizContainer({ quizId, courseId, moduleId, lessonOrder, onClose }: QuizContainerProps) {
  const t = useTranslations('quiz');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<QuizAttempt | null>(null);
  //const [startTime] = useState(Date.now());

  // Fetch quiz function
  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getQuizById(quizId);

      if (!response.success || !response.quiz) {
        throw new Error(response.error || t('fetchError'));
      }

      setQuiz(response.quiz);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('fetchError');
      setError(errorMessage);
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  }, [quizId, t]);

  // Fetch quiz on mount
  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Check if all questions are answered
    const unansweredQuestions = quiz.questions.filter(
      (q) => !userAnswers[q._id] || userAnswers[q._id].trim() === ''
    );

    if (unansweredQuestions.length > 0) {
      const confirmSubmit = window.confirm(
        t('confirmSubmit', { count: unansweredQuestions.length })
      );
      if (!confirmSubmit) return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Calculate time spent
      //const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      // Convert answers to array format
      const answersArray = Object.entries(userAnswers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      const response = await submitQuizAttempt(
        courseId,
        moduleId,
        {
          quizId: quiz._id,
          lessonOrder,  
          score: 0,     
          totalQuestions: quiz.questions.length,
          passed: false,
          answers: answersArray.map(a => ({
            questionId: a.questionId,
            answer: a.answer,
            //isCorrect: false
          }))
        }
      );

      if (!response.success || !response.attempt) {
        throw new Error(response.error || t('submitError'));
      }

      setResults(response.attempt);
      setIsSubmitted(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('submitError');
      setError(errorMessage);
      console.error('Error submitting quiz:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-card rounded-xl p-8 max-w-md w-full mx-4 border border-border shadow-lg">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-lg text-foreground">{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !quiz) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-card rounded-xl p-8 max-w-md w-full mx-4 border border-border shadow-lg">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('oops')}</h3>
            <p className="text-destructive mb-6">{error}</p>
            <Button onClick={onClose} variant="secondary">
              {t('close')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No quiz available
  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-card rounded-xl p-8 max-w-md w-full mx-4 border border-border shadow-lg">
          <div className="text-center">
            <div className="text-muted-foreground text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('noQuiz')}</h3>
            <p className="text-muted-foreground mb-6">{t('noQuizMessage')}</p>
            <Button onClick={onClose} variant="secondary">
              {t('close')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show results if submitted
  if (isSubmitted && results) {
    return <QuizResults results={results} quiz={quiz} onClose={onClose} />;
  }

  // Main quiz interface
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const currentAnswer = userAnswers[currentQuestion._id] || '';
  const isAnswered = currentAnswer.trim() !== '';

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card rounded-xl shadow-2xl max-w-3xl w-full my-8 border border-border">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6 rounded-t-xl">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{quiz.title}</h2>
              <p className="text-primary-foreground/90 text-sm">
                {t('questionProgress', { current: currentQuestionIndex + 1, total: quiz.questions.length })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-primary-foreground hover:text-primary-foreground/80 transition-colors ml-4"
              aria-label={t('closeQuiz')}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-primary-foreground/20 rounded-full h-2">
            <div
              className="bg-primary-foreground h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6 min-h-[300px]">
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {currentQuestion.type === 'mcq' || currentQuestion.type === 'true-false' ? (
            <MCQQuestion
              question={currentQuestion}
              selectedAnswer={currentAnswer}
              onAnswerChange={(answer) => handleAnswerChange(currentQuestion._id, answer)}
            />
          ) : (
            <ShortAnswerQuestion
              question={currentQuestion}
              answer={currentAnswer}
              onAnswerChange={(answer) => handleAnswerChange(currentQuestion._id, answer)}
            />
          )}
        </div>

        {/* Navigation Footer */}
        <div className="p-6 bg-muted rounded-b-xl border-t border-border">
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('previous')}
            </Button>

            <div className="text-sm text-muted-foreground">
              {isAnswered ? (
                <span className="text-accent-foreground font-medium">✓ {t('answered')}</span>
              ) : (
                <span className="text-secondary-foreground">{t('notAnswered')}</span>
              )}
            </div>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('submitting')}
                  </>
                ) : (
                  t('submitQuiz')
                )}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {t('next')}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>

          {/* Answer summary */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {quiz.questions.map((q, idx) => {
                const isAnswered = userAnswers[q._id] && userAnswers[q._id].trim() !== '';
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary/20'
                        : isAnswered
                        ? 'bg-accent text-accent-foreground hover:opacity-80'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                    title={`${t('question')} ${idx + 1}${isAnswered ? ` (${t('answered')})` : ''}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}