import crypto from "crypto";

/**
 * Generate unique certificate number
 * Format: RC-YYYY-NNNNNN (e.g., RC-2024-000123)
 */
export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `RC-${year}-${random}`;
}

/**
 * Generate unique verification code
 * Format: 16-character alphanumeric code
 */
export function generateVerificationCode(): string {
  return crypto.randomBytes(8).toString("hex").toUpperCase();
}

/**
 * Format date for certificate display
 */
export function formatCertificateDate(
  date: Date,
  locale: string = "en"
): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Intl.DateTimeFormat(
    locale === "fr" ? "fr-FR" : "en-US",
    options
  ).format(date);
}

/**
 * Calculate final course score from progress
 */
export function calculateFinalScore(
  completedLessons: number,
  totalLessons: number,
  quizzesPassed: number,
  totalQuizzes: number
): number {
  // 50% weight for lesson completion, 50% for quiz performance
  const lessonScore = (completedLessons / totalLessons) * 50;
  const quizScore = (quizzesPassed / totalQuizzes) * 50;

  return Math.round(lessonScore + quizScore);
}

/**
 * Format time spent for certificate
 */
export function formatTimeSpent(
  minutes: number,
  locale: string = "en"
): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (locale === "fr") {
    if (hours === 0) return `${mins} minutes`;
    if (mins === 0) return `${hours} heure${hours > 1 ? "s" : ""}`;
    return `${hours} heure${hours > 1 ? "s" : ""} ${mins} minutes`;
  }

  if (hours === 0) return `${mins} minutes`;
  if (mins === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${hours} hour${hours > 1 ? "s" : ""} ${mins} minutes`;
}

/**
 * Generate certificate HTML template
 */
export function generateCertificateHTML(data: {
  certificateNumber: string;
  studentName: string;
  courseName: string;
  completionDate: string;
  issueDate: string;
  finalScore: number;
  totalLessons: number;
  totalQuizzes: number;
  timeSpent: string;
  issuedBy: string;
  signatory: string;
  signatoryTitle: string;
  verificationCode: string;
  locale?: string;
}): string {
  const locale = data.locale || "en";
  const isEnglish = locale === "en";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificate of Completion</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Georgia', serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    
    .certificate {
      width: 297mm;
      height: 210mm;
      background: white;
      padding: 40px 60px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      position: relative;
      overflow: hidden;
    }
    
    .certificate::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 15px solid #667eea;
      pointer-events: none;
    }
    
    .certificate::after {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      width: calc(100% - 40px);
      height: calc(100% - 40px);
      border: 2px solid #764ba2;
      pointer-events: none;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .logo {
      font-size: 36px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 10px;
    }
    
    .title {
      font-size: 48px;
      font-weight: bold;
      color: #2d3748;
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-bottom: 10px;
    }
    
    .subtitle {
      font-size: 20px;
      color: #718096;
      font-style: italic;
    }
    
    .content {
      text-align: center;
      margin: 40px 0;
    }
    
    .awarded {
      font-size: 18px;
      color: #4a5568;
      margin-bottom: 20px;
    }
    
    .student-name {
      font-size: 42px;
      font-weight: bold;
      color: #667eea;
      margin: 20px 0;
      text-transform: capitalize;
      border-bottom: 2px solid #667eea;
      display: inline-block;
      padding-bottom: 10px;
    }
    
    .course-info {
      font-size: 20px;
      color: #2d3748;
      margin: 30px 0;
      line-height: 1.6;
    }
    
    .course-name {
      font-weight: bold;
      color: #764ba2;
      font-size: 24px;
    }
    
    .metrics {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin: 30px 0;
      flex-wrap: wrap;
    }
    
    .metric {
      text-align: center;
    }
    
    .metric-value {
      font-size: 32px;
      font-weight: bold;
      color: #667eea;
    }
    
    .metric-label {
      font-size: 14px;
      color: #718096;
      margin-top: 5px;
    }
    
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 50px;
    }
    
    .signature-block {
      text-align: center;
    }
    
    .signature-line {
      width: 200px;
      border-top: 2px solid #2d3748;
      margin-bottom: 10px;
    }
    
    .signature-name {
      font-weight: bold;
      color: #2d3748;
      font-size: 16px;
    }
    
    .signature-title {
      color: #718096;
      font-size: 14px;
      font-style: italic;
    }
    
    .certificate-info {
      text-align: right;
      font-size: 12px;
      color: #718096;
    }
    
    .certificate-number {
      font-weight: bold;
      color: #667eea;
      margin-bottom: 5px;
    }
    
    .verification {
      margin-top: 5px;
    }
    
    .seal {
      position: absolute;
      bottom: 60px;
      left: 60px;
      width: 120px;
      height: 120px;
      border: 3px solid #667eea;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(102, 126, 234, 0.1);
    }
    
    .seal-text {
      font-size: 12px;
      font-weight: bold;
      color: #667eea;
      text-align: center;
      line-height: 1.2;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="seal">
      <div class="seal-text">
        ${isEnglish ? "OFFICIAL" : "OFFICIEL"}<br>
        ${isEnglish ? "CERTIFICATE" : "CERTIFICAT"}
      </div>
    </div>
    
    <div class="header">
      <div class="logo">🎓 ${data.issuedBy}</div>
      <div class="title">${
        isEnglish ? "Certificate of Completion" : "Certificat de Réussite"
      }</div>
      <div class="subtitle">${
        isEnglish ? "This is to certify that" : "Ceci certifie que"
      }</div>
    </div>
    
    <div class="content">
      <div class="student-name">${data.studentName}</div>
      
      <div class="course-info">
        ${
          isEnglish
            ? "has successfully completed the course"
            : "a terminé avec succès le cours"
        }
        <br>
        <span class="course-name">${data.courseName}</span>
      </div>
      
      <div class="metrics">
        <div class="metric">
          <div class="metric-value">${data.finalScore}%</div>
          <div class="metric-label">${
            isEnglish ? "Final Score" : "Score Final"
          }</div>
        </div>
        <div class="metric">
          <div class="metric-value">${data.totalLessons}</div>
          <div class="metric-label">${
            isEnglish ? "Lessons Completed" : "Leçons Complétées"
          }</div>
        </div>
        <div class="metric">
          <div class="metric-value">${data.totalQuizzes}</div>
          <div class="metric-label">${
            isEnglish ? "Quizzes Passed" : "Quiz Réussis"
          }</div>
        </div>
        <div class="metric">
          <div class="metric-value">${data.timeSpent}</div>
          <div class="metric-label">${
            isEnglish ? "Time Invested" : "Temps Investi"
          }</div>
        </div>
      </div>
      
      <div class="course-info" style="font-size: 16px; margin-top: 20px;">
        ${isEnglish ? "Date of Completion:" : "Date de Réussite:"} <strong>${
    data.completionDate
  }</strong>
      </div>
    </div>
    
    <div class="footer">
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="signature-name">${data.signatory}</div>
        <div class="signature-title">${data.signatoryTitle}</div>
      </div>
      
      <div class="certificate-info">
        <div class="certificate-number">${
          isEnglish ? "Certificate No:" : "Certificat N°:"
        } ${data.certificateNumber}</div>
        <div>${isEnglish ? "Issue Date:" : "Date d'Émission:"} ${
    data.issueDate
  }</div>
        <div class="verification">
          ${
            isEnglish ? "Verification Code:" : "Code de Vérification:"
          } <strong>${data.verificationCode}</strong>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
