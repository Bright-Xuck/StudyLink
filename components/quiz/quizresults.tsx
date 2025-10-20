// components/Quiz/QuizResults.tsx
'use client';

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
}

interface QuestionResult {
  questionId: string;
  questionText: string;
  questionType: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
  maxPoints: number;
  explanation?: string | null;
}

interface Results {
  score: number;
  totalPoints: number;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  results: QuestionResult[];
  passedQuiz: boolean;
}

interface QuizResultsProps {
  results: Results;
  quiz: Quiz;
  onClose: () => void;
}

export default function QuizResults({ results, quiz, onClose }: QuizResultsProps) {
  const { score, totalPoints, percentage, correctCount, totalQuestions, results: questionResults, passedQuiz } = results;

  // Determine performance message and styling
  const getPerformance = () => {
    if (percentage >= 90) return { 
      text: 'Outstanding! 🎉', 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: '🏆'
    };
    if (percentage >= 75) return { 
      text: 'Great Job! 👏', 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: '⭐'
    };
    if (percentage >= 60) return { 
      text: 'Good Effort! 👍', 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: '✓'
    };
    return { 
      text: 'Keep Practicing! 💪', 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: '📚'
    };
  };

  const performance = getPerformance();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">Quiz Complete! 🎊</h2>
              <p className="text-lg opacity-90">{quiz.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl leading-none transition-colors ml-4"
              aria-label="Close results"
            >
              ×
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
                    className="text-gray-200"
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
                    className={percentage >= 60 ? 'text-green-500' : 'text-orange-500'}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute">
                  <div className="text-5xl font-bold text-gray-800">{percentage}%</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-3xl font-bold text-gray-800">{score}</p>
                <p className="text-sm text-gray-600">Points Earned</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-3xl font-bold text-gray-800">{totalPoints}</p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-3xl font-bold text-green-600">{correctCount}</p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-3xl font-bold text-red-600">{totalQuestions - correctCount}</p>
                <p className="text-sm text-gray-600">Incorrect</p>
              </div>
            </div>

            {/* Pass/Fail Badge */}
            <div className="mt-6">
              {passedQuiz ? (
                <span className="inline-block px-6 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-lg">
                  ✓ Passed
                </span>
              ) : (
                <span className="inline-block px-6 py-2 bg-orange-100 text-orange-800 rounded-full font-semibold text-lg">
                  Review and try again
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="p-6 max-h-[500px] overflow-y-auto">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
            <span className="mr-2">📋</span>
            Review Your Answers
          </h3>
          
          <div className="space-y-6">
            {questionResults.map((result, index) => {
              const question = quiz.questions.find((q) => q._id === result.questionId);

              return (
                <div
                  key={result.questionId}
                  className={`p-5 rounded-xl border-2 ${
                    result.isCorrect
                      ? 'border-green-400 bg-green-50'
                      : 'border-red-400 bg-red-50'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-800 text-lg flex items-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 text-sm mr-3">
                        {index + 1}
                      </span>
                      Question {index + 1}
                    </h4>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                        result.isCorrect
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>

                  {/* Question Text */}
                  <p className="text-gray-800 font-medium mb-4 text-base leading-relaxed">
                    {result.questionText}
                  </p>

                  {/* Answers */}
                  <div className="space-y-3">
                    {/* Your Answer */}
                    <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                      <span className="font-semibold text-gray-700 block mb-1">Your Answer:</span>
                      <span className={`${result.isCorrect ? 'text-green-700' : 'text-red-700'} font-medium`}>
                        {result.userAnswer || '(No answer provided)'}
                      </span>
                    </div>

                    {/* Correct Answer (if incorrect) */}
                    {!result.isCorrect && (
                      <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700 block mb-1">Correct Answer:</span>
                        <span className="text-green-700 font-medium">
                          {result.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Points */}
                  <div className="mt-3 text-sm font-medium text-gray-600">
                    Points: {result.points} / {result.maxPoints}
                  </div>

                  {/* Explanation */}
                  {result.explanation && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm text-blue-900">
                        <strong className="font-semibold">💡 Explanation:</strong>
                        <span className="ml-2">{result.explanation}</span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              Close and Return to Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}