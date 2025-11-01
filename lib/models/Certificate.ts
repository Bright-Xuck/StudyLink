import mongoose, { Document, Model } from "mongoose";

export interface ICertificate extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;

  // Certificate details
  certificateNumber: string; // Unique certificate ID (e.g., "RC-2024-001234")
  studentName: string;
  courseName: string;
  courseNameFr: string;

  // Completion details
  completionDate: Date;
  issueDate: Date;

  // Performance metrics
  finalScore: number; // Overall course score (%)
  totalLessons: number;
  totalQuizzes: number;
  timeSpent: number; // Total minutes spent

  // Certificate metadata
  issuedBy: string; // "ResearchEthics Platform" or institution name
  signatory: string; // Name of person signing
  signatoryTitle: string; // Title of signatory

  // Verification
  verificationCode: string; // Unique code for verification
  verified: boolean;

  // PDF storage
  pdfUrl?: string; // URL to stored PDF
  pdfGenerated: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new mongoose.Schema<ICertificate>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    courseNameFr: {
      type: String,
      required: true,
    },
    completionDate: {
      type: Date,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    finalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totalLessons: {
      type: Number,
      required: true,
    },
    totalQuizzes: {
      type: Number,
      required: true,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    issuedBy: {
      type: String,
      default: "ResearchEthics Platform",
    },
    signatory: {
      type: String,
      default: "Dr. John Doe",
    },
    signatoryTitle: {
      type: String,
      default: "Director of Academic Programs",
    },
    verificationCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    pdfUrl: {
      type: String,
    },
    pdfGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user-course uniqueness
CertificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Index for verification lookups
CertificateSchema.index({ verificationCode: 1 });
CertificateSchema.index({ certificateNumber: 1 });

const Certificate: Model<ICertificate> =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>("Certificate", CertificateSchema);

export default Certificate;
