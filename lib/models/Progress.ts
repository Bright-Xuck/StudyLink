import mongoose, { Document, Model } from "mongoose";

export interface ILessonProgress {
  moduleId: string;
  lessonOrder: number;
  completed: boolean;
  completedAt?: Date;
  timeSpent: number; // in minutes
  lastAccessedAt: Date;
  quizPassed: boolean; // Track if lesson quiz passed
  quizScore?: number;
}

export interface IModuleProgress {
  moduleId: mongoose.Types.ObjectId;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  completed: boolean;
  completedAt?: Date;
}

export interface IQuizAttempt {
  quizId: string;
  moduleId: string;
  lessonOrder?: number; // If it's a lesson quiz
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
  courseId: mongoose.Types.ObjectId; // Track at course level

  // Module tracking
  modulesProgress: IModuleProgress[];
  totalModules: number;
  completedModules: number;

  // Lesson tracking across all modules
  lessonsProgress: ILessonProgress[];
  totalLessons: number;
  completedLessons: number;

  // Overall course progress
  courseProgressPercentage: number;

  // Quiz tracking across all modules/lessons
  quizAttempts: IQuizAttempt[];
  totalQuizzesPassed: number;
  totalQuizzesRequired: number;

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
  moduleId: {
    type: String,
    required: true,
  },
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
  quizPassed: {
    type: Boolean,
    default: false,
  },
  quizScore: {
    type: Number,
  },
});

const ModuleProgressSchema = new mongoose.Schema<IModuleProgress>({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  completedLessons: {
    type: Number,
    default: 0,
  },
  totalLessons: {
    type: Number,
    required: true,
  },
  progressPercentage: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
});

const QuizAttemptSchema = new mongoose.Schema<IQuizAttempt>({
  quizId: {
    type: String,
    required: true,
  },
  moduleId: {
    type: String,
    required: true,
  },
  lessonOrder: {
    type: Number,
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
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Changed from moduleId
      required: true,
    },
    modulesProgress: [ModuleProgressSchema],
    totalModules: {
      type: Number,
      required: true,
      default: 0,
    },
    completedModules: {
      type: Number,
      default: 0,
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
    courseProgressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    quizAttempts: [QuizAttemptSchema],
    totalQuizzesPassed: {
      type: Number,
      default: 0,
    },
    totalQuizzesRequired: {
      type: Number,
      default: 0,
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
ProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Method to update progress percentage
// Method to update progress percentage
ProgressSchema.methods.updateProgress = async function () {
  // Calculate completed lessons across all modules
  // A lesson is considered complete if it's marked as completed
  // (regardless of quiz status - quiz is optional/separate)
  this.completedLessons = this.lessonsProgress.filter(
    (lesson: ILessonProgress) => lesson.completed
  ).length;

  // Update module-level progress
  for (const moduleProgress of this.modulesProgress) {
    const moduleId = moduleProgress.moduleId.toString();
    
    // Count completed lessons in this module
    const completedInModule = this.lessonsProgress.filter(
      (lp: ILessonProgress) => 
        lp.moduleId.toString() === moduleId && lp.completed
    ).length;
    
    moduleProgress.completedLessons = completedInModule;
    
    // Calculate module progress percentage
    if (moduleProgress.totalLessons > 0) {
      moduleProgress.progressPercentage = Math.round(
        (completedInModule / moduleProgress.totalLessons) * 100
      );
    }
    
    // Mark module as completed if all lessons are done
    if (completedInModule === moduleProgress.totalLessons && !moduleProgress.completed) {
      moduleProgress.completed = true;
      moduleProgress.completedAt = new Date();
    }
  }

  // Calculate completed modules
  this.completedModules = this.modulesProgress.filter(
    (module: IModuleProgress) => module.completed
  ).length;

  // Calculate overall course progress based on completed lessons
  if (this.totalLessons > 0) {
    this.courseProgressPercentage = Math.round(
      (this.completedLessons / this.totalLessons) * 100
    );
  }

  // Count passed quizzes (separate tracking)
  this.totalQuizzesPassed = this.quizAttempts.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (attempt: any) => attempt.passed
  ).length;

  // Check if course is fully completed
  // Course is complete when all lessons are done AND all required quizzes are passed
  if (
    this.courseProgressPercentage === 100 &&
    this.totalQuizzesPassed >= this.totalQuizzesRequired &&
    !this.completedAt
  ) {
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
