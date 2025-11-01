// ============================================
// components/quiz/MCQQuestion.tsx
// ============================================
'use client';

import { useTranslations } from 'next-intl';

interface Question {
  _id: string;
  questionText: string;
  options?: string[];
  points: number;
}

interface MCQQuestionProps {
  question: Question;
  selectedAnswer: string;
  onAnswerChange: (answer: string) => void;
}

export default function MCQQuestion({
  question,
  selectedAnswer,
  onAnswerChange,
}: MCQQuestionProps) {
  const t = useTranslations('quiz');

  if (!question.options || question.options.length === 0) {
    return (
      <div className="text-center text-destructive p-4">
        <p>{t('errorNoOptions')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-3 leading-relaxed">
          {question.questionText}
        </h3>
        <div className="flex items-center gap-2">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
            {question.points} {question.points === 1 ? t('point') : t('points')}
          </span>
          <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-sm font-medium rounded-full">
            {t('multipleChoice')}
          </span>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const optionLabel = String.fromCharCode(65 + index); // A, B, C, D...
          const isSelected = selectedAnswer === option;

          return (
            <label
              key={index}
              className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center h-6">
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value={option}
                  checked={isSelected}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-start">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold mr-3 ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {optionLabel}
                  </span>
                  <span className={`text-base leading-relaxed ${
                    isSelected ? 'text-foreground font-medium' : 'text-foreground/90'
                  }`}>
                    {option}
                  </span>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Warning if no answer selected */}
      {!selectedAnswer && (
        <div className="mt-4 p-3 bg-secondary/20 border border-secondary rounded-lg">
          <p className="text-sm text-secondary-foreground flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {t('selectAnswer')}
          </p>
        </div>
      )}
    </div>
  );
}