import mongoose, { Schema, Document, Model } from "mongoose";

// Question Interface
export interface IQuestion {
  _id?: mongoose.Types.ObjectId;
  type: "mcq" | "true-false" | "short-answer";
  questionText: string;
  questionTextFr: string;
  options?: string[];
  optionsFr?: string[];
  correctAnswer: string;
  correctAnswerFr?: string;
  points: number;
  explanation?: string;
  explanationFr?: string;
  order: number;
}

// Quiz Interface
export interface IQuiz extends Document {
  _id: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId; 
  moduleId: mongoose.Types.ObjectId; 
  title: string;
  titleFr: string; 
  description?: string;
  descriptionFr?: string;
  questions: IQuestion[];
  passingScore: number;
  timeLimit?: number; 
  maxAttempts?: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Quiz Attempt Interface
export interface IQuizAttempt extends Document {
  _id: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId; 
  userId: mongoose.Types.ObjectId; 
  moduleId: mongoose.Types.ObjectId; 
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean; 
  answers: IAttemptAnswer[];
  timeSpent?: number; 
  attemptNumber: number;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Answer Interface for attempts
export interface IAttemptAnswer {
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  pointsAwarded: number;
  pointsPossible: number;
}

// Question Schema
const QuestionSchema = new Schema<IQuestion>({
  type: {
    type: String,
    enum: ["mcq", "true-false", "short-answer"],
    required: true,
  },
  questionText: {
    type: String,
    required: true,
    trim: true,
  },
  questionTextFr: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    validate: {
      validator: function (this: IQuestion, value: string[] | undefined) {
        // Options required for MCQ and true-false
        if (this.type === "mcq" || this.type === "true-false") {
          return value && value.length >= 2;
        }
        return true;
      },
      message: "MCQ and True-False questions must have at least 2 options",
    },
  },
  optionsFr: {
    type: [String],
    validate: {
      validator: function (this: IQuestion, value: string[] | undefined) {
        // Must match English options length if provided
        if (this.options && value) {
          return value.length === this.options.length;
        }
        return true;
      },
      message: "French options must match English options count",
    },
  },
  correctAnswer: {
    type: String,
    required: true,
    trim: true,
  },
  correctAnswerFr: {
    type: String,
    trim: true,
  },
  points: {
    type: Number,
    default: 1,
    min: [1, "Points must be at least 1"],
  },
  explanation: {
    type: String,
    trim: true,
  },
  explanationFr: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    required: true,
    min: [1, "Order must be at least 1"],
  },
});

// Answer Schema for attempts
const AttemptAnswerSchema = new Schema<IAttemptAnswer>({
  questionId: {
    type: String,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  userAnswer: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  pointsAwarded: {
    type: Number,
    required: true,
  },
  pointsPossible: {
    type: Number,
    required: true,
  },
});

// Quiz Schema
const QuizSchema = new Schema<IQuiz>(
  {
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    titleFr: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    descriptionFr: {
      type: String,
      trim: true,
    },
    questions: {
      type: [QuestionSchema],
      validate: {
        validator: function (value: IQuestion[]) {
          return value.length > 0;
        },
        message: "Quiz must have at least one question",
      },
    },
    passingScore: {
      type: Number,
      default: 85,
      min: [0, "Passing score cannot be negative"],
      max: [100, "Passing score cannot exceed 100"],
    },
    timeLimit: {
      type: Number,
      min: [1, "Time limit must be at least 1 minute"],
    },
    maxAttempts: {
      type: Number,
      default: 3,
      min: [1, "Must allow at least 1 attempt"],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Quiz Attempt Schema
const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: [0, "Score cannot be negative"],
    },
    totalPoints: {
      type: Number,
      required: true,
      min: [1, "Total points must be at least 1"],
    },
    percentage: {
      type: Number,
      required: true,
      min: [0, "Percentage cannot be negative"],
      max: [100, "Percentage cannot exceed 100"],
    },
    passed: {
      type: Boolean,
      required: true,
    },
    answers: {
      type: [AttemptAnswerSchema],
      required: true,
    },
    timeSpent: {
      type: Number,
      min: [0, "Time spent cannot be negative"],
    },
    attemptNumber: {
      type: Number,
      required: true,
      min: [1, "Attempt number must be at least 1"],
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

// Indexes for better query performance
QuizSchema.index({ moduleId: 1, lessonId: 1 });
QuizSchema.index({ isPublished: 1 });

QuizAttemptSchema.index({ userId: 1, quizId: 1 });
QuizAttemptSchema.index({ userId: 1, moduleId: 1 });
QuizAttemptSchema.index({ quizId: 1, userId: 1, attemptNumber: 1 });

// Virtual to calculate total possible points
QuizSchema.virtual("totalPoints").get(function (this: IQuiz) {
  return this.questions.reduce((sum, q) => sum + q.points, 0);
});

// Method to check if user can attempt quiz
QuizAttemptSchema.statics.canUserAttempt = async function (
  userId: mongoose.Types.ObjectId,
  quizId: mongoose.Types.ObjectId,
  maxAttempts?: number
) {
  if (!maxAttempts) return true; // Unlimited attempts

  const attemptCount = await this.countDocuments({ userId, quizId });
  return attemptCount < maxAttempts;
};

// Method to get user's best attempt
QuizAttemptSchema.statics.getBestAttempt = async function (
  userId: mongoose.Types.ObjectId,
  quizId: mongoose.Types.ObjectId
) {
  return await this.findOne({ userId, quizId })
    .sort({ percentage: -1, completedAt: 1 })
    .lean();
};

// Create or use existing models
const Quiz: Model<IQuiz> =
  mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);

const QuizAttempt: Model<IQuizAttempt> =
  mongoose.models.QuizAttempt ||
  mongoose.model<IQuizAttempt>("QuizAttempt", QuizAttemptSchema);

export { Quiz, QuizAttempt };
export default Quiz;
