import mongoose, { Document, Model } from "mongoose";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;

  // Payment details
  amount: number;
  currency: string;

  // Fapshi transaction details
  transactionId: string; // Fapshi transId
  externalId: string; // Our unique reference

  // User details
  phone: string;
  email?: string;

  // Payment status
  status: "created" | "pending" | "successful" | "failed" | "expired";

  // Payment method
  medium: "mobile money" | "orange money";

  // Timestamps
  initiatedAt: Date;
  completedAt?: Date;

  // Additional info
  failureReason?: string;
  metadata?: Record<string, unknown>;
}

const PaymentSchema = new mongoose.Schema<IPayment>(
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
    amount: {
      type: Number,
      required: true,
      min: 100, // Minimum Fapshi amount
    },
    currency: {
      type: String,
      default: "XAF",
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    externalId: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      match: /^6[\d]{8}$/,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "successful", "failed", "expired"],
      default: "pending",
    },
    medium: {
      type: String,
      enum: ["mobile money", "orange money"],
      default: "mobile money",
    },
    initiatedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    failureReason: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
PaymentSchema.index({ userId: 1, status: 1 });
//PaymentSchema.index({ transactionId: 1 });
//PaymentSchema.index({ externalId: 1 });
PaymentSchema.index({ status: 1, initiatedAt: -1 });

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
