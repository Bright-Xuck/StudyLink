/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/actions/auth.actions";
import { getUserCertificates } from "@/lib/actions/certificate.actions";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import CertificateCard from "@/components/dashboard/CertificateCard";
import { Award, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function CertificatesPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const t = await getTranslations("certificates");
  const locale = await getLocale();
  const certificates = await getUserCertificates();

  // Calculate statistics
  const totalCertificates = certificates.length;
  const averageScore =
    totalCertificates > 0
      ? Math.round(
          certificates.reduce((sum: number, cert: any) => sum + cert.finalScore, 0) /
            totalCertificates
        )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-8 md:px-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t("myCertificates")}
          </h1>
          <p className="text-muted-foreground">{t("certificatesDescription")}</p>
        </div>

        {/* Stats */}
        {totalCertificates > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("totalCertificates")}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {totalCertificates}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/20 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("averageScore")}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {averageScore}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t("noCertificates")}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t("noCertificatesMessage")}
            </p>
            <Link
              href="/courses"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              {t("browseCourses")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate: any) => (
              <CertificateCard
                key={certificate._id}
                certificate={certificate}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
