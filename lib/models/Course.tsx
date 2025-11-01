import mongoose, { Document, Model } from "mongoose";

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  slug: string;
  imageUrl: string;
  
  // Department/Faculty
  department: string; // e.g., "Computer Science", "Life Sciences"
  faculty?: string; // e.g., "Faculty of Science"
  
  // Pricing - Course level pricing
  isFree: boolean;
  price?: number;
  currency: string;
  
  // Course metadata
  duration: string; // e.g., "3 months"
  level: "beginner" | "intermediate" | "advanced";
  
  // Modules in this course
  modules: mongoose.Types.ObjectId[]; // References to Module documents
  
  // Learning outcomes
  objectives: string[];
  objectivesFr: string[];
  
  // Prerequisites
  prerequisites?: string[];
  prerequisitesFr?: string[];
  
  // Instructor/Author info
  instructor?: string;
  instructorBio?: string;
  
  // Publishing
  isPublished: boolean;
  order: number;
  
  // Stats
  enrolledCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new mongoose.Schema<ICourse>(
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
    department: {
      type: String,
      required: true,
      enum: [
        // Faculty of Science
        "Computer Science",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Microbiology",
        "Biochemistry",
        "Geology",
        // Faculty of Social & Management Sciences
        "Economics",
        "Management",
        "Sociology",
        "Psychology",
        // Faculty of Arts
        "English",
        "French",
        "Linguistics",
        // Faculty of Education
        "Curriculum Studies",
        "Educational Psychology",
        // Faculty of Health Sciences
        "Nursing",
        "Public Health",
        // Faculty of Engineering
        "Civil Engineering",
        "Electrical Engineering",
        // General
        "General Studies",
        "All Departments",
      ],
    },
    faculty: {
      type: String,
      enum: [
        "Faculty of Science",
        "Faculty of Social & Management Sciences",
        "Faculty of Arts",
        "Faculty of Education",
        "Faculty of Health Sciences",
        "Faculty of Engineering",
        "General",
      ],
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "XAF",
    },
    duration: {
      type: String,
      default: "3 months",
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
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
    prerequisites: [
      {
        type: String,
      },
    ],
    prerequisitesFr: [
      {
        type: String,
      },
    ],
    instructor: {
      type: String,
    },
    instructorBio: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      required: true,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CourseSchema.index({ slug: 1 });
CourseSchema.index({ department: 1 });
CourseSchema.index({ isPublished: 1, order: 1 });
CourseSchema.index({ isFree: 1 });

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;