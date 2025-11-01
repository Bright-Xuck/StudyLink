import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function CTA() {
  const t = useTranslations();

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {t("cta.title")}
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          {t("cta.description")}
        </p>
        <Link
          href="/register"
          className="inline-block bg-background text-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
        >
          {t("cta.button")}
        </Link>
      </div>
    </section>
  );
}