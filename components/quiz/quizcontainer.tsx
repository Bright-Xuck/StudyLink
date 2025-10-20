// components/Quiz/QuizContainer.tsx
'use client';

import { useState, useEffect } from 'react';
import MCQQuestion from './mcqquestion';
import StructuralQuestion from './structural';
import QuizResults from './quizresults';

interface Question {
  _id: string;
  type: 'mcq' | 'structural';
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
}

interface QuizContainerProps {
  lessonId: string;
  onClose: () => void;
  userId: string;
}

export default function QuizContainer({ lessonId, onClose, userId }: QuizContainerProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Fetch quiz on mount
  useEffect(() => {
    fetchQuiz();
  }, [lessonId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/quiz/${lessonId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch quiz');
      }

      if (!data.success || !data.data) {
        throw new Error('No quiz available for this lesson');
      }

      setQuiz(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load quiz. Please try again.');
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

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
        `You have ${unansweredQuestions.length} unanswered question(s). Do you want to submit anyway?`
      );
      if (!confirmSubmit) return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Convert answers to array format
      const answersArray = Object.entries(userAnswers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quiz._id,
          userId,
          answers: answersArray,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit quiz');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to process quiz results');
      }

      setResults(data.data);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz. Please try again.');
      console.error('Error submitting quiz:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg text-gray-700">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !quiz) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops!</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No quiz available
  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-gray-400 text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Quiz Available</h3>
            <p className="text-gray-600 mb-6">There is no quiz for this lesson yet.</p>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{quiz.title}</h2>
              <p className="text-blue-100 text-sm">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl leading-none transition-colors ml-4"
              aria-label="Close quiz"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-blue-800 bg-opacity-30 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6 min-h-[300px]">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {currentQuestion.type === 'mcq' ? (
            <MCQQuestion
              question={currentQuestion}
              selectedAnswer={currentAnswer}
              onAnswerChange={(answer) => handleAnswerChange(currentQuestion._id, answer)}
            />
          ) : (
            <StructuralQuestion
              question={currentQuestion}
              answer={currentAnswer}
              onAnswerChange={(answer) => handleAnswerChange(currentQuestion._id, answer)}
            />
          )}
        </div>

        {/* Navigation Footer */}
        <div className="p-6 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:hover:bg-gray-200"
            >
              ← Previous
            </button>

            <div className="text-sm text-gray-600">
              {isAnswered ? (
                <span className="text-green-600 font-medium">✓ Answered</span>
              ) : (
                <span className="text-amber-600">Not answered</span>
              )}
            </div>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-2 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Quiz'
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
              >
                Next →
              </button>
            )}
          </div>

          {/* Answer summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
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
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : isAnswered
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    title={`Question ${idx + 1}${isAnswered ? ' (Answered)' : ''}`}
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