import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendWelcomeEmail(
  email: string,
  name: string,
  locale: string = "en"
) {
  const subject =
    locale === "fr"
      ? "Bienvenue sur StudyLink"
      : "Welcome to StudyLink";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3B82F6;">${
        locale === "fr" ? "Bienvenue" : "Welcome"
      }, ${name}!</h1>
      <p>${
        locale === "fr"
          ? "Merci de vous être inscrit sur StudyLink."
          : "Thank you for signing up for StudyLink."
      }</p>
      <p>${
        locale === "fr"
          ? "Vous pouvez maintenant accéder à nos leçons et matières scolaires."
          : "You can now access our school subjects and lessons."
      }</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}" 
         style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
        ${locale === "fr" ? "Commencer" : "Get Started"}
      </a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });
    console.log("✅ Welcome email sent to:", email);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string,
  locale: string = "en"
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/reset-password?token=${resetToken}`;

  const subject =
    locale === "fr"
      ? "Réinitialisation du mot de passe"
      : "Password Reset Request";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3B82F6;">${
        locale === "fr" ? "Réinitialisation du mot de passe" : "Password Reset"
      }</h1>
      <p>${locale === "fr" ? "Bonjour" : "Hello"} ${name},</p>
      <p>${
        locale === "fr"
          ? "Vous avez demandé à réinitialiser votre mot de passe pour StudyLink. Cliquez sur le bouton ci-dessous pour continuer :"
          : "You requested to reset your StudyLink password. Click the button below to continue:"
      }</p>
      <a href="${resetUrl}" 
         style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
        ${locale === "fr" ? "Réinitialiser le mot de passe" : "Reset Password"}
      </a>
      <p style="margin-top: 24px; color: #666;">
        ${
          locale === "fr"
            ? "Si vous n'avez pas demandé cette réinitialisation, ignorez cet email."
            : "If you did not request this reset, please ignore this email."
        }
      </p>
      <p style="color: #666; font-size: 12px;">
        ${
          locale === "fr"
            ? "Ce lien expire dans 1 heure."
            : "This link expires in 1 hour."
        }
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });
    console.log("✅ Password reset email sent to:", email);
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
  }
}
