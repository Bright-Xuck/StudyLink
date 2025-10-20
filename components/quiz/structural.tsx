// components/Quiz/StructuralQuestion.tsx
'use client';

interface Question {
  _id: string;
  questionText: string;
  points: number;
}

interface StructuralQuestionProps {
  question: Question;
  answer: string;
  onAnswerChange: (answer: string) => void;
}

export default function StructuralQuestion({
  question,
  answer,
  onAnswerChange,
}: StructuralQuestionProps) {
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = answer.length;
  const minWords = 10; // Minimum word count suggestion
  const minChars = 50; // Minimum character count

  return (
    <div className="space-y-5">
      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-relaxed">
          {question.questionText}
        </h3>
        <div className="flex items-center gap-2">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            {question.points} {question.points === 1 ? 'point' : 'points'}
          </span>
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            Written Answer
          </span>
        </div>
      </div>

      {/* Textarea for Answer */}
      <div>
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Type your answer here... Be clear and detailed in your response."
          className="w-full min-h-[250px] p-4 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-y transition-colors text-gray-900 placeholder-gray-400"
          rows={10}
        />
        
        {/* Character and Word Counter */}
        <div className="flex justify-between items-center mt-3 text-sm">
          <div className="flex items-center gap-4">
            <span className={`font-medium ${
              wordCount < minWords ? 'text-amber-600' : 'text-green-600'
            }`}>
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
              {wordCount < minWords && (
                <span className="text-gray-500 ml-1">
                  (suggest at least {minWords})
                </span>
              )}
            </span>
            <span className="text-gray-500">
              {charCount} characters
            </span>
          </div>
          
          {!answer.trim() && (
            <span className="text-amber-600 font-medium">
              Answer required
            </span>
          )}
        </div>
      </div>

      {/* Helper Tips */}
      <div className="grid md:grid-cols-2 gap-3 mt-4">
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <p className="text-sm text-blue-900">
            <strong className="font-semibold">💡 Tip:</strong> Write a clear and detailed answer. Be specific and support your points with examples where applicable.
          </p>
        </div>
        <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
          <p className="text-sm text-purple-900">
            <strong className="font-semibold">✍️ Remember:</strong> Quality matters more than quantity. Focus on answering the question directly and thoroughly.
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      {wordCount > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Answer length</span>
            <span>{Math.min(100, Math.round((wordCount / minWords) * 100))}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                wordCount >= minWords ? 'bg-green-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, (wordCount / minWords) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}