"use server";

import { connectDB } from "@/lib/db";
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
import bcrypt from "bcryptjs";
import { ZodError } from "zod";

export async function registerUser(data: RegisterInput, locale: string = "en") {
  try {
    // Validate input
    const validatedData = registerSchema.parse(data);

    const sql = await connectDB();

    const [existingUser] = await sql`SELECT id FROM users WHERE email = ${validatedData.email.toLowerCase()} LIMIT 1`;
    if (existingUser) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Un compte avec cet email existe déjà"
            : "A user with this email already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const [user] = await sql`
      INSERT INTO users (name, email, password, phone, department, role)
      VALUES (${validatedData.name}, ${validatedData.email.toLowerCase()}, ${hashedPassword}, ${validatedData.phone ?? null}, ${validatedData.department ?? null}, 'student')
      RETURNING id, name, email, role
    `;

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
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
        id: user.id,
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

    const sql = await connectDB();

    const [user] = await sql`
      SELECT id, name, email, password, role
      FROM users
      WHERE email = ${validatedData.email.toLowerCase()}
      LIMIT 1
    `;

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
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

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
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set auth cookie
    await setAuthCookie(token);

    return {
      success: true,
      message: locale === "fr" ? "Connexion réussie!" : "Login successful!",
      user: {
        id: user.id,
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

    const sql = await connectDB();

    const [user] = await sql`
      SELECT id, name, email, phone, department, role, purchased_courses
      FROM users
      WHERE id = ${tokenPayload.userId}
      LIMIT 1
    `;

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      department: user.department,
      role: user.role,
      purchasedModules: (user.purchased_courses || []).map((id: string) => String(id)),
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

    const sql = await connectDB();

    const [user] = await sql`SELECT id, email, name FROM users WHERE email = ${validatedData.email.toLowerCase()} LIMIT 1`;

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
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await sql`
      UPDATE users
      SET reset_password_token = ${hashedToken}, reset_password_expires = ${expiresAt}
      WHERE id = ${user.id}
    `;

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
    const sql = await connectDB();

    // Hash the token from URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const [user] = await sql`
      SELECT id
      FROM users
      WHERE reset_password_token = ${hashedToken}
        AND reset_password_expires > NOW()
      LIMIT 1
    `;

    if (!user) {
      return {
        success: false,
        error:
          locale === "fr"
            ? "Le lien de réinitialisation est invalide ou a expiré"
            : "Reset link is invalid or has expired",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await sql`
      UPDATE users
      SET password = ${hashedPassword}, reset_password_token = NULL, reset_password_expires = NULL
      WHERE id = ${user.id}
    `;

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