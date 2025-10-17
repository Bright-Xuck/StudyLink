import mongoose, { Document, Model } from "mongoose";

export interface ILessonProgress {
  lessonOrder: number;
  completed: boolean;
  completedAt?: Date;
  timeSpent: number; // in minutes
  lastAccessedAt: Date;
}

export interface IQuizAttempt {
  quizId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  attemptedAt: Date;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;

  // Lesson tracking
  lessonsProgress: ILessonProgress[];
  totalLessons: number;
  completedLessons: number;

  // Overall progress
  progressPercentage: number;

  // Quiz tracking
  quizAttempts: IQuizAttempt[];
  bestQuizScore: number;
  quizPassed: boolean;

  // Certificate
  certificateIssued: boolean;
  certificateIssuedAt?: Date;
  certificateId?: string;

  // Timestamps
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;

  // Methods
  updateProgress(): Promise<void>;
}

const LessonProgressSchema = new mongoose.Schema<ILessonProgress>({
  lessonOrder: {
    type: Number,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  timeSpent: {
    type: Number,
    default: 0,
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
});

const QuizAttemptSchema = new mongoose.Schema<IQuizAttempt>({
  quizId: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
  answers: [
    {
      questionId: String,
      selectedAnswer: String,
      isCorrect: Boolean,
    },
  ],
});

const ProgressSchema = new mongoose.Schema<IProgress>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    lessonsProgress: [LessonProgressSchema],
    totalLessons: {
      type: Number,
      required: true,
      default: 0,
    },
    completedLessons: {
      type: Number,
      default: 0,
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    quizAttempts: [QuizAttemptSchema],
    bestQuizScore: {
      type: Number,
      default: 0,
    },
    quizPassed: {
      type: Boolean,
      default: false,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateIssuedAt: {
      type: Date,
    },
    certificateId: {
      type: String,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
ProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

// Method to update progress percentage
ProgressSchema.methods.updateProgress = async function () {
  // Calculate completed lessons
  this.completedLessons = this.lessonsProgress.filter(
    (lesson: ILessonProgress) => lesson.completed
  ).length;

  // Calculate progress percentage
  if (this.totalLessons > 0) {
    this.progressPercentage = Math.round(
      (this.completedLessons / this.totalLessons) * 100
    );
  }

  // Check if module is fully completed
  if (this.progressPercentage === 100 && this.quizPassed && !this.completedAt) {
    this.completedAt = new Date();
  }

  // Update last accessed
  this.lastAccessedAt = new Date();

  await this.save();
};

const Progress: Model<IProgress> =
  mongoose.models.Progress ||
  mongoose.model<IProgress>("Progress", ProgressSchema);

export default Progress;
