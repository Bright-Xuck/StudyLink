import { redirect, notFound } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/actions/auth.actions";
import { getModuleBySlug } from "@/lib/actions/module.actions";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Lock, CreditCard, Shield } from "lucide-react";
import CheckoutForm from "@/components/payment/CheckoutForm";

type CheckoutPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const moduleSlug = params.module as string;

  if (!moduleSlug) {
    return notFound();
  }

  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(`/login?redirect=/payment/checkout?module=${moduleSlug}`);
  }

  const t = await getTranslations("payment");
  const courseModule = await getModuleBySlug(moduleSlug);

  if (!courseModule) {
    return notFound();
  }

  // Check if module is free
  if (courseModule.isFree) {
    redirect(`/modules/${moduleSlug}`);
  }

  // Check if already purchased
  if (user.purchasedModules.includes(courseModule._id)) {
    redirect(`/modules/${moduleSlug}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("checkout.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("checkout.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form - Left Side */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t("checkout.paymentDetails")}
                </h2>
                <CheckoutForm
                  moduleId={courseModule._id}
                  moduleSlug={courseModule.slug}
                  amount={courseModule.price || 0}
                  moduleName={courseModule.title}
                />
              </div>

              {/* Security Notice */}
              <div className="mt-6 bg-muted rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t("checkout.securePayment")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("checkout.securePaymentDescription")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary - Right Side */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h3 className="text-xl font-bold text-foreground mb-6">
                  {t("checkout.orderSummary")}
                </h3>

                {/* Module Info */}
                <div className="mb-6">
                  <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={courseModule.imageUrl}
                      alt={courseModule.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {courseModule.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {courseModule.description}
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 py-4 border-t border-b border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("checkout.modulePrice")}
                    </span>
                    <span className="font-medium text-foreground">
                      {new Intl.NumberFormat("fr-CM", {
                        style: "currency",
                        currency: "XAF",
                      }).format(courseModule.price || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("checkout.fees")}
                    </span>
                    <span className="font-medium text-foreground">
                      {t("checkout.included")}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-4 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-foreground">
                      {t("checkout.total")}
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {new Intl.NumberFormat("fr-CM", {
                        style: "currency",
                        currency: "XAF",
                      }).format(courseModule.price || 0)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("checkout.oneTimePayment")}
                  </p>
                </div>

                {/* What's Included */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-3">
                    {t("checkout.whatsIncluded")}
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      {t("checkout.lifetimeAccess")}
                    </li>
                    <li className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      {t("checkout.allLessons")}
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      {t("checkout.certificate")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}