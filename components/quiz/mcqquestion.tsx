// components/Quiz/MCQQuestion.tsx
'use client';

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
  if (!question.options || question.options.length === 0) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: This multiple choice question has no options.</p>
      </div>
    );
  }

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
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
            Multiple Choice
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
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center h-6">
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value={option}
                  checked={isSelected}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-start">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold mr-3 ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {optionLabel}
                  </span>
                  <span className={`text-base leading-relaxed ${
                    isSelected ? 'text-gray-900 font-medium' : 'text-gray-800'
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
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Please select an answer before proceeding
          </p>
        </div>
      )}
    </div>
  );
}