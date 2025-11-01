"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Loader2, CheckCircle, XCircle } from "lucide-react";
import { initiateCoursePayment, checkPaymentStatus } from "@/lib/actions/payment.actions";
import { toast } from "sonner";

interface CheckoutFormProps {
  courseId: string;
  courseSlug: string;
  amount: number;
}

type PaymentStatus = "idle" | "initiating" | "pending" | "checking" | "success" | "failed";

export default function CheckoutForm({
  courseId,
  courseSlug,
  amount,
}: CheckoutFormProps) {
  const t = useTranslations("payment");
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [medium, setMedium] = useState<"mobile money" | "orange money">("mobile money");
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [transactionId, setTransactionId] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Check status every 5 seconds when pending
  const startStatusCheck = (transId: string) => {
    const checkInterval = setInterval(async () => {
      setStatus("checking");
      const result = await checkPaymentStatus(transId);
      //toast.info(result.data?.status || "qwer");

      if (result.data) {
        if (result.data.status === "successful") {
          clearInterval(checkInterval);
          setStatus("success");
          toast.success(result.message);
          
          // Redirect to module page after 2 seconds
          setTimeout(() => {
            router.push(`/courses/${courseSlug}`);
          }, 2000);
        } else if (result.data.status === "failed" || result.data.status === "expired") {
          clearInterval(checkInterval);
          setStatus("failed");
          setError(result.error || t("checkout.paymentFailed"));
          toast.error(result.error || t("checkout.paymentFailed"));
        } else {
          // Still pending
          setStatus("pending");
        }
      }
    }, 5000); // Check every 5 seconds

    // Stop checking after 5 minutes
    setTimeout(() => {
      clearInterval(checkInterval);
      if (status === "pending" || status === "checking") {
        setStatus("failed");
        setError(t("checkout.paymentTimeout"));
        toast.error(t("checkout.paymentTimeout"));
      }
    }, 300000); // 5 minutes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate phone
    if (!/^6[\d]{8}$/.test(phone)) {
      setError(t("checkout.invalidPhone"));
      toast.error(t("checkout.invalidPhone"));
      return;
    }

    setStatus("initiating");

    // Initiate payment
    const result = await initiateCoursePayment(courseId, phone, medium);

    console.log("initiateModulePayment result:", result);

    if (result.success && result.data) {
      setTransactionId(result.data.transactionId);
      setStatus("pending");
      toast.success(result.message);
      
      // Start checking status
      startStatusCheck(result.data.transactionId);
    } else {
      setStatus("failed");
      setError(result.error || t("checkout.initiationFailed"));
      toast.error(result.error || t("checkout.initiationFailed"));
    }
  };

  const handleManualCheck = async () => {
    if (!transactionId) return;

    setStatus("checking");
    const result = await checkPaymentStatus(transactionId);

    if (result.success && result.data) {
      if (result.data.status === "successful") {
        setStatus("success");
        toast.success(result.message);
        setTimeout(() => {
          router.push(`/courses/${courseSlug}`);
        }, 2000);
      } else if (result.data.status === "failed" || result.data.status === "expired") {
        setStatus("failed");
        setError(result.error || t("checkout.paymentFailed"));
        toast.error(result.error || t("checkout.paymentFailed"));
      } else {
        setStatus("pending");
        toast.info(result.message);
      }
    } else {
      setError(result.error || t("checkout.checkFailed"));
      toast.error(result.error || t("checkout.checkFailed"));
      setStatus("pending");
    }
  };

  // Success State
  if (status === "success") {
    return (
      <div className="text-center py-12">
        <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-accent" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {t("checkout.paymentSuccess")}
        </h3>
        <p className="text-muted-foreground mb-6">
          {t("checkout.paymentSuccessMessage")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("checkout.redirecting")}
        </p>
      </div>
    );
  }

  // Failed State
  if (status === "failed") {
    return (
      <div className="text-center py-12">
        <div className="bg-destructive/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {t("checkout.paymentFailed")}
        </h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button
          onClick={() => {
            setStatus("idle");
            setError("");
            setTransactionId("");
          }}
          variant="default"
        >
          {t("checkout.tryAgain")}
        </Button>
      </div>
    );
  }

  // Pending State
  if (status === "pending" || status === "checking") {
    return (
      <div className="text-center py-12">
        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Smartphone className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {t("checkout.waitingForPayment")}
        </h3>
        <p className="text-muted-foreground mb-6">
          {t("checkout.checkYourPhone")}
        </p>
        <div className="bg-muted rounded-lg p-6 mb-6">
          <p className="text-sm text-foreground mb-2">
            {t("checkout.transactionId")}: <span className="font-mono font-bold">{transactionId}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {status === "checking" ? t("checkout.checking") : t("checkout.waitingConfirmation")}
          </p>
        </div>
        <Button
          onClick={handleManualCheck}
          disabled={status === "checking"}
          variant="outline"
        >
          {status === "checking" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("checkout.checking")}
            </>
          ) : (
            t("checkout.checkStatus")
          )}
        </Button>
      </div>
    );
  }

  // Payment Form
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method */}
      <div>
        <Label className="text-base font-semibold mb-3 block">
          {t("checkout.paymentMethod")}
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setMedium("mobile money")}
            className={`p-4 rounded-lg border-2 transition-all ${
              medium === "mobile money"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="text-center">
              <Smartphone className="h-8 w-8 mx-auto mb-2 text-primary" />
              <span className="font-medium text-foreground">MTN Mobile Money</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMedium("orange money")}
            className={`p-4 rounded-lg border-2 transition-all ${
              medium === "orange money"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="text-center">
              <Smartphone className="h-8 w-8 mx-auto mb-2 text-secondary" />
              <span className="font-medium text-foreground">Orange Money</span>
            </div>
          </button>
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <Label htmlFor="phone" className="text-base font-semibold">
          {t("checkout.phoneNumber")}
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          {t("checkout.phoneHint")}
        </p>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            +237
          </span>
          <Input
            id="phone"
            type="tel"
            placeholder="6XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            maxLength={9}
            className="pl-16"
            required
          />
        </div>
        {error && (
          <p className="text-sm text-destructive mt-2">{error}</p>
        )}
      </div>

      {/* Amount Display */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{t("checkout.amount")}</span>
          <span className="text-2xl font-bold text-foreground">
            {new Intl.NumberFormat("fr-CM", {
              style: "currency",
              currency: "XAF",
            }).format(amount)}
          </span>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h4 className="font-semibold text-foreground mb-2">
          {t("checkout.howItWorks")}
        </h4>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="font-bold text-primary">1.</span>
            <span>{t("checkout.step1")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-primary">2.</span>
            <span>{t("checkout.step2")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-primary">3.</span>
            <span>{t("checkout.step3")}</span>
          </li>
        </ol>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === "initiating" || !phone}
      >
        {status === "initiating" ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t("checkout.processing")}
          </>
        ) : (
          <>
            <Smartphone className="mr-2 h-5 w-5" />
            {t("checkout.payNow")}
          </>
        )}
      </Button>

      {/* Terms */}
      <p className="text-xs text-center text-muted-foreground">
        {t("checkout.terms")}
      </p>
    </form>
  );
}