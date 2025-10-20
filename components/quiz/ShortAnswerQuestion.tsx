// ============================================
// components/quiz/ShortAnswerQuestion.tsx
// ============================================
'use client';

import { useTranslations } from 'next-intl';

interface Question {
  _id: string;
  questionText: string;
  points: number;
}

interface ShortAnswerQuestionProps {
  question: Question;
  answer: string;
  onAnswerChange: (answer: string) => void;
}

export default function ShortAnswerQuestion({
  question,
  answer,
  onAnswerChange,
}: ShortAnswerQuestionProps) {
  const t = useTranslations('quiz');
  
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = answer.length;
  const minWords = 10;

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
            {t('writtenAnswer')}
          </span>
        </div>
      </div>

      {/* Textarea for Answer */}
      <div>
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder={t('answerPlaceholder')}
          className="w-full min-h-[250px] p-4 border-2 border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-y transition-colors bg-background text-foreground placeholder-muted-foreground"
          rows={10}
        />
        
        {/* Character and Word Counter */}
        <div className="flex justify-between items-center mt-3 text-sm">
          <div className="flex items-center gap-4">
            <span className={`font-medium ${
              wordCount < minWords ? 'text-secondary-foreground' : 'text-accent-foreground'
            }`}>
              {wordCount} {wordCount === 1 ? t('word') : t('words')}
              {wordCount < minWords && (
                <span className="text-muted-foreground ml-1">
                  ({t('suggestMinWords', { count: minWords })})
                </span>
              )}
            </span>
            <span className="text-muted-foreground">
              {charCount} {t('characters')}
            </span>
          </div>
          
          {!answer.trim() && (
            <span className="text-secondary-foreground font-medium">
              {t('answerRequired')}
            </span>
          )}
        </div>
      </div>

      {/* Helper Tips */}
      <div className="grid md:grid-cols-2 gap-3 mt-4">
        <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
          <p className="text-sm text-foreground">
            <strong className="font-semibold">💡 {t('tip')}:</strong> {t('tipMessage')}
          </p>
        </div>
        <div className="bg-accent/20 border-l-4 border-accent p-4 rounded">
          <p className="text-sm text-foreground">
            <strong className="font-semibold">✏️ {t('remember')}:</strong> {t('rememberMessage')}
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      {wordCount > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{t('answerLength')}</span>
            <span>{Math.min(100, Math.round((wordCount / minWords) * 100))}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                wordCount >= minWords ? 'bg-accent' : 'bg-secondary'
              }`}
              style={{ width: `${Math.min(100, (wordCount / minWords) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}