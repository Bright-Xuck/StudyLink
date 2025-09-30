import mongoose, { Document, Model } from "mongoose";

export interface IModule extends Document {
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  slug: string;
  imageUrl: string;
  isFree: boolean;
  price?: number;
  content: string;
  contentFr: string;
  duration: string; // e.g., "4 weeks"
  level: "beginner" | "intermediate" | "advanced";
  objectives: string[];
  objectivesFr: string[];
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new mongoose.Schema<IModule>(
  {
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
    isFree: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
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

// Index for faster queries
ModuleSchema.index({ slug: 1 });
ModuleSchema.index({ order: 1 });
ModuleSchema.index({ isFree: 1 });

const Module: Model<IModule> =
  mongoose.models.Module || mongoose.model<IModule>("Module", ModuleSchema);

export default Module;
