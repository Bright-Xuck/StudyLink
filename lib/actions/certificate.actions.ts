"use server";

import { connectDB } from "@/lib/db";
import Certificate from "@/lib/models/Certificate";
import Course from "@/lib/models/Course";
import User from "@/lib/models/User";
import Progress from "@/lib/models/Progress";
import { getCurrentUser } from "@/lib/utils/jwt";
import {
  generateCertificateNumber,
  generateVerificationCode,
  formatCertificateDate,
  calculateFinalScore,
  formatTimeSpent,
  generateCertificateHTML,
} from "@/lib/utils/certificate";
import { getLocale } from "next-intl/server";
import mongoose from "mongoose";

interface PopulatedCertificate {
  certificateNumber: string;
  studentName: string;
  completionDate: Date;
  issueDate: Date;
  finalScore: number;
  verified: boolean;
  verificationCode: string;
  userId: {
    name: string;
    email: string;
  };
  courseId: {
    title: string;
    titleFr: string;
  };
}

/**
 * Generate certificate for a completed course
 */
export async function generateCertificate(courseId: string) {
  const locale = await getLocale();

  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) {
      return {
        success: false,
        error: locale === "fr" ? "Non authentifié" : "Not authenticated",
      };
    }

    await connectDB();

    // Check if user completed the course
    const progress = await Progress.findOne({
      userId: tokenPayload.userId,
      courseId: new mongoose.Types.ObjectId(courseId),
    }).lean();

    if (!progress) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Aucun progrès trouvé pour ce cours"
            : "No progress found for this course",
      };
    }

    // Verify completion requirements
    if (progress.courseProgressPercentage !== 100) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Cours non terminé. Complétez toutes les leçons."
            : "Course not completed. Complete all lessons first.",
      };
    }

    if (progress.totalQuizzesPassed < progress.totalQuizzesRequired) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Tous les quiz n'ont pas été réussis"
            : "Not all quizzes have been passed",
      };
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      userId: tokenPayload.userId,
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    if (existingCertificate) {
      return {
        success: true,
        message:
          locale === "fr"
            ? "Certificat déjà émis"
            : "Certificate already issued",
        certificate: JSON.parse(JSON.stringify(existingCertificate)),
      };
    }

    // Get user and course info
    const [user, course] = await Promise.all([
      User.findById(tokenPayload.userId),
      Course.findById(courseId),
    ]);

    if (!user || !course) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Utilisateur ou cours introuvable"
            : "User or course not found",
      };
    }

    // Calculate final score
    const finalScore = calculateFinalScore(
      progress.completedLessons,
      progress.totalLessons,
      progress.totalQuizzesPassed,
      progress.totalQuizzesRequired
    );

    // Calculate time spent
    const timeSpent = progress.lessonsProgress.reduce(
      (sum, lp) => sum + (lp.timeSpent || 0),
      0
    );

    // Generate certificate
    const certificate = await Certificate.create({
      userId: user._id,
      courseId: course._id,
      certificateNumber: generateCertificateNumber(),
      studentName: user.name,
      courseName: course.title,
      courseNameFr: course.titleFr,
      completionDate: progress.completedAt || new Date(),
      issueDate: new Date(),
      finalScore,
      totalLessons: progress.totalLessons,
      totalQuizzes: progress.totalQuizzesRequired,
      timeSpent,
      verificationCode: generateVerificationCode(),
      verified: true,
      pdfGenerated: false,
    });

    // Update progress with certificate info
    progress.certificateIssued = true;
    progress.certificateIssuedAt = new Date();
    progress.certificateId = certificate._id.toString();
    await Progress.findByIdAndUpdate(progress._id, {
      certificateIssued: true,
      certificateIssuedAt: new Date(),
      certificateId: certificate._id.toString(),
    });

    return {
      success: true,
      message:
        locale === "fr"
          ? "Certificat généré avec succès!"
          : "Certificate generated successfully!",
      certificate: JSON.parse(JSON.stringify(certificate)),
    };
  } catch (error) {
    console.error("Generate certificate error:", error);
    return {
      success: false,
      error:
        locale === "fr"
          ? "Erreur lors de la génération du certificat"
          : "Certificate generation error",
    };
  }
}

/**
 * Get certificate by ID
 */
export async function getCertificateById(certificateId: string) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return null;

    await connectDB();

    const certificate = await Certificate.findOne({
      _id: certificateId,
      userId: tokenPayload.userId,
    })
      .populate("courseId")
      .lean();

    return certificate ? JSON.parse(JSON.stringify(certificate)) : null;
  } catch (error) {
    console.error("Get certificate error:", error);
    return null;
  }
}

/**
 * Get user's certificate for a course
 */
export async function getCourseCertificate(courseId: string) {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return null;

    await connectDB();

    const certificate = await Certificate.findOne({
      userId: tokenPayload.userId,
      courseId: new mongoose.Types.ObjectId(courseId),
    })
      .populate("courseId")
      .lean();

    return certificate ? JSON.parse(JSON.stringify(certificate)) : null;
  } catch (error) {
    console.error("Get course certificate error:", error);
    return null;
  }
}

/**
 * Get all certificates for current user
 */
export async function getUserCertificates() {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return [];

    await connectDB();

    const certificates = await Certificate.find({
      userId: tokenPayload.userId,
    })
      .populate("courseId")
      .sort({ issueDate: -1 })
      .lean();

    return JSON.parse(JSON.stringify(certificates));
  } catch (error) {
    console.error("Get user certificates error:", error);
    return [];
  }
}

/**
 * Verify certificate by certificate number
 */
export async function verifyCertificate(certificateNumber: string) {
  const locale = await getLocale();

  try {
    await connectDB();

    const certificate = await Certificate.findOne({
      certificateNumber,
      verified: true,
    })
      .populate("userId", "name email")
      .populate("courseId", "title titleFr")
      .lean();

    if (!certificate) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Certificat non trouvé ou non vérifié"
            : "Certificate not found or not verified",
      };
    }

    return {
      success: true,
      certificate: {
        certificateNumber: certificate.certificateNumber,
        studentName: certificate.studentName,
        courseName:
          locale === "fr"
            ? (certificate as unknown as PopulatedCertificate).courseId.titleFr
            : (certificate as unknown as PopulatedCertificate).courseId.title,
        completionDate: certificate.completionDate,
        issueDate: certificate.issueDate,
        finalScore: certificate.finalScore,
        verified: certificate.verified,
        verificationCode: certificate.verificationCode,
      },
    };
  } catch (error) {
    console.error("Verify certificate error:", error);
    return {
      success: false,
      error:
        locale === "fr"
          ? "Erreur lors de la vérification"
          : "Verification error",
    };
  }
}

/**
 * Verify certificate by verification code
 */
export async function verifyCertificateByCode(verificationCode: string) {
  const locale = await getLocale();

  try {
    await connectDB();

    const certificate = await Certificate.findOne({
      verificationCode: verificationCode.toUpperCase(),
      verified: true,
    })
      .populate("userId", "name email")
      .populate("courseId", "title titleFr")
      .lean();

    if (!certificate) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Code de vérification invalide"
            : "Invalid verification code",
      };
    }

    return {
      success: true,
      certificate: {
        certificateNumber: certificate.certificateNumber,
        studentName: certificate.studentName,
        courseName:
          locale === "fr"
            ? (certificate as unknown as PopulatedCertificate).courseId.titleFr
            : (certificate as unknown as PopulatedCertificate).courseId.title,
        completionDate: certificate.completionDate,
        issueDate: certificate.issueDate,
        finalScore: certificate.finalScore,
        verified: certificate.verified,
        verificationCode: certificate.verificationCode,
      },
    };
  } catch (error) {
    console.error("Verify certificate by code error:", error);
    return {
      success: false,
      error:
        locale === "fr"
          ? "Erreur lors de la vérification"
          : "Verification error",
    };
  }
}

/**
 * Generate certificate HTML/PDF preview
 */
export async function getCertificatePreview(certificateId: string) {
  const locale = await getLocale();

  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) {
      return {
        success: false,
        error: locale === "fr" ? "Non authentifié" : "Not authenticated",
      };
    }

    await connectDB();

    const certificate = await Certificate.findOne({
      _id: certificateId,
      userId: tokenPayload.userId,
    }).lean();

    if (!certificate) {
      return {
        success: false,
        error:
          locale === "fr" ? "Certificat introuvable" : "Certificate not found",
      };
    }

    // Generate HTML
    const html = generateCertificateHTML({
      certificateNumber: certificate.certificateNumber,
      studentName: certificate.studentName,
      courseName:
        locale === "fr" ? certificate.courseNameFr : certificate.courseName,
      completionDate: formatCertificateDate(certificate.completionDate, locale),
      issueDate: formatCertificateDate(certificate.issueDate, locale),
      finalScore: certificate.finalScore,
      totalLessons: certificate.totalLessons,
      totalQuizzes: certificate.totalQuizzes,
      timeSpent: formatTimeSpent(certificate.timeSpent, locale),
      issuedBy: certificate.issuedBy,
      signatory: certificate.signatory,
      signatoryTitle: certificate.signatoryTitle,
      verificationCode: certificate.verificationCode,
      locale,
    });

    return {
      success: true,
      html,
      certificate: JSON.parse(JSON.stringify(certificate)),
    };
  } catch (error) {
    console.error("Get certificate preview error:", error);
    return {
      success: false,
      error:
        locale === "fr"
          ? "Erreur lors de la génération de l'aperçu"
          : "Preview generation error",
    };
  }
}

/**
 * Get certificate statistics for admin
 */
export async function getCertificateStatistics() {
  const locale = await getLocale();

  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload || tokenPayload.role !== "admin") {
      return {
        success: false,
        error: locale === "fr" ? "Non autorisé" : "Unauthorized",
      };
    }

    await connectDB();

    const totalCertificates = await Certificate.countDocuments();
    const thisMonthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const certificatesThisMonth = await Certificate.countDocuments({
      issueDate: { $gte: thisMonthStart },
    });

    const avgScoreResult = await Certificate.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$finalScore" },
        },
      },
    ]);

    const averageScore =
      avgScoreResult.length > 0
        ? Math.round(avgScoreResult[0].averageScore)
        : 0;

    // Certificates by course
    const byCourse = await Certificate.aggregate([
      {
        $group: {
          _id: "$courseId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $project: {
          courseName: locale === "fr" ? "$course.titleFr" : "$course.title",
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    return {
      success: true,
      statistics: {
        totalCertificates,
        certificatesThisMonth,
        averageScore,
        topCourses: byCourse,
      },
    };
  } catch (error) {
    console.error("Get certificate statistics error:", error);
    return {
      success: false,
      error:
        locale === "fr"
          ? "Erreur lors du calcul des statistiques"
          : "Statistics calculation error",
    };
  }
}

/**
 * Download certificate as HTML (for PDF conversion)
 */
export async function downloadCertificate(certificateId: string) {
  return getCertificatePreview(certificateId);
}
