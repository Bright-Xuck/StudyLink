import mongoose, { Document, Model } from "mongoose";

export interface ILesson {
  _id?: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  type: "video" | "reading" | "document";
  content: string; // Video URL, document URL, or HTML content
  contentFr?: string; // For bilingual content
  duration: number; // in minutes
  order: number;
  isPreview: boolean; // Can be viewed without enrollment
  hasQuiz: boolean; // Every lesson will have a quiz
}

export interface IModule extends Document {
  _id: string;
  courseId: mongoose.Types.ObjectId; // Reference to parent course
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  slug: string;
  imageUrl: string;
  content: string;
  contentFr: string;
  duration: string; // e.g., "4 weeks"
  level: "beginner" | "intermediate" | "advanced";
  objectives: string[];
  objectivesFr: string[];
  lessons: ILesson[];
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new mongoose.Schema<ILesson>({
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
    required: true,
  },
  descriptionFr: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["video", "reading", "document"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  contentFr: {
    type: String,
  },
  duration: {
    type: Number,
    required: true,
    default: 15,
  },
  order: {
    type: Number,
    required: true,
  },
  isPreview: {
    type: Boolean,
    default: false,
  },
  hasQuiz: {
    type: Boolean,
    default: true, // Every lesson has a quiz
  },
});

const ModuleSchema = new mongoose.Schema<IModule>(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
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
      required: true,
    },
    descriptionFr: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    contentFr: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: "2 weeks",
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    objectives: [
      {
        type: String,
      },
    ],
    objectivesFr: [
      {
        type: String,
      },
    ],
    lessons: [LessonSchema],
    order: {
      type: Number,
      required: true,
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

// Indexes for faster queries
ModuleSchema.index({ courseId: 1, order: 1 });
ModuleSchema.index({ isPublished: 1 });

const Module: Model<IModule> =
  mongoose.models.Module || mongoose.model<IModule>("Module", ModuleSchema);

export default Module;
