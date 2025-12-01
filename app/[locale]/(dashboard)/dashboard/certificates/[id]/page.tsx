import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/actions/auth.actions";
import { getCertificatePreview } from "@/lib/actions/certificate.actions";
import { getTranslations } from "next-intl/server";

export default async function CertificateViewPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const t = await getTranslations("certificates");
  const result = await getCertificatePreview(params.id);

  if (!result.success || !result.html) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-xl p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-destructive mb-2">
            {t("certificateNotFound")}
          </h2>
          <p className="text-muted-foreground">{result.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div
        className="certificate-preview"
        dangerouslySetInnerHTML={{ __html: result.html }}
      />
    </div>
  );
}
