// lib/models/Quiz.ts
import mongoose, { Schema, Document } from 'mongoose';

// Question Interface
export interface IQuestion {
  _id?: string;
  type: 'mcq' | 'structural';
  questionText: string;
  options?: string[];
  correctAnswer: string;
  points: number;
  explanation?: string;
  order: number;
}

// Quiz Interface
export interface IQuiz extends Document {
  lessonId: string;
  moduleId: string;
  title: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

// Quiz Attempt Interface
export interface IQuizAttempt extends Document {
  quizId: string;
  userId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  answers: any[];
  completedAt: Date;
}

// Question Schema
const QuestionSchema = new Schema({
  type: {
    type: String,
    enum: ['mcq', 'structural'],
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    default: undefined,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 1,
  },
  explanation: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
  },
});

// Quiz Schema
const QuizSchema = new Schema<IQuiz>(
  {
    lessonId: {
      type: String,
      required: true,
      index: true,
    },
    moduleId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    questions: [QuestionSchema],
  },
  {
    timestamps: true,
  }
);

// Quiz Attempt Schema
const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quizId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalPoints: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    answers: {
      type: Schema.Types.Mixed,
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create or use existing models
const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);
const QuizAttempt = mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);

export { Quiz, QuizAttempt };
export default Quiz;