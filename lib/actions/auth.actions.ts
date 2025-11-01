"use server";

import { connectDB } from "@/lib/db";
import User, { IUser } from "@/lib/models/User";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  type RegisterInput,
  type LoginInput,
  type ForgotPasswordInput,
} from "@/lib/validations/auth.schema";
import {
  generateToken,
  setAuthCookie,
  removeAuthCookie,
  getCurrentUser,
} from "@/lib/utils/jwt";
import { sendWelcomeEmail, sendPasswordResetEmail } from "@/lib/utils/email";
import crypto from "crypto";
import { ZodError } from "zod";
import mongoose from "mongoose";

export async function registerUser(data: RegisterInput, locale: string = "en") {
  try {
    // Validate input
    const validatedData = registerSchema.parse(data);

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Un compte avec cet email existe déjà"
            : "A user with this email already exists",
      };
    }

    // Create new user
    const user = (await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      phone: validatedData.phone,
      department: validatedData.department,
      role: "student",
    })) as IUser & { _id: mongoose.Types.ObjectId };

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Set auth cookie
    await setAuthCookie(token);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name, locale).catch(console.error);

    return {
      success: true,
      message:
        locale === "fr"
          ? "Compte créé avec succès!"
          : "Account created successfully!",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error:
        locale === "fr"
          ? "Une erreur est survenue lors de l'inscription"
          : "An error occurred during registration",
    };
  }
}

export async function loginUser(data: LoginInput, locale: string = "en") {
  try {
    // Validate input
    const validatedData = loginSchema.parse(data);

    // Connect to database
    await connectDB();

    // Find user and include password
    const user = (await User.findOne({ email: validatedData.email }).select(
      "+password"
    )) as (IUser & { _id: mongoose.Types.ObjectId }) | null;

    if (!user) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Email ou mot de passe incorrect"
            : "Invalid email or password",
      };
    }

    // Check password
    const isPasswordValid = await user.comparePassword(validatedData.password);

    if (!isPasswordValid) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Email ou mot de passe incorrect"
            : "Invalid email or password",
      };
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Set auth cookie
    await setAuthCookie(token);

    return {
      success: true,
      message: locale === "fr" ? "Connexion réussie!" : "Login successful!",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error:
        locale === "fr"
          ? "Une erreur est survenue lors de la connexion"
          : "An error occurred during login",
    };
  }
}

export async function logoutUser(locale: string = "en") {
  try {
    await removeAuthCookie();
    return {
      success: true,
      message: locale === "fr" ? "Déconnexion réussie" : "Logout successful",
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error:
        locale === "fr"
          ? "Une erreur est survenue lors de la déconnexion"
          : "An error occurred during logout",
    };
  }
}

export async function getAuthenticatedUser() {
  try {
    const tokenPayload = await getCurrentUser();

    if (!tokenPayload) {
      return null;
    }

    await connectDB();

    const user = (await User.findById(tokenPayload.userId).select(
      "-password"
    )) as (IUser & { _id: mongoose.Types.ObjectId }) | null;

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      department: user.department,
      role: user.role,
      purchasedModules: user.purchasedCourses.map((id) => id.toString()),
    };
  } catch (error) {
    console.error("Get authenticated user error:", error);
    return null;
  }
}

export async function requestPasswordReset(
  data: ForgotPasswordInput,
  locale: string = "en"
) {
  try {
    const validatedData = forgotPasswordSchema.parse(data);

    await connectDB();

    const user = await User.findOne({ email: validatedData.email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        message:
          locale === "fr"
            ? "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé"
            : "If an account exists with this email, a reset link has been sent",
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token and expiry to database
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(user.email, user.name, resetToken, locale);

    return {
      success: true,
      message:
        locale === "fr"
          ? "Email de réinitialisation envoyé"
          : "Password reset email sent",
    };
  } catch (error) {
    console.error("Password reset request error:", error);

    return {
      success: false,
      error: locale === "fr" ? "Une erreur est survenue" : "An error occurred",
    };
  }
}


export async function resetPassword(
  token: string,
  newPassword: string,
  locale: string = "en"
) {
  try {
    await connectDB();

    // Hash the token from URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Le lien de réinitialisation est invalide ou a expiré"
            : "Reset link is invalid or has expired",
      };
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return {
      success: true,
      message:
        locale === "fr"
          ? "Mot de passe réinitialisé avec succès"
          : "Password reset successfully",
    };
  } catch (error) {
    console.error("Password reset error:", error);

    return {
      success: false,
      error: locale === "fr" ? "Une erreur est survenue" : "An error occurred",
    };
  }
}