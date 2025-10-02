"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  FileText, 
  Download, 
  ArrowLeft,
  ExternalLink,
  File,
  Lock,
  Cookie,
  AlertTriangle,
  Printer,
  ShieldCheck
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface LegalDocumentLayoutProps {
  title: string;
  lastUpdated: string;
  version: string;
  type: 'terms' | 'privacy' | 'cookies' | 'disclaimer' | 'compliance';
  children: React.ReactNode;
}

export function LegalDocumentLayout({
  title,
  lastUpdated,
  version,
  type,
  children
}: LegalDocumentLayoutProps) {
  const t = useTranslations("Legal");

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    // This would integrate with a PDF generation service
    // For now, we'll just open the print dialog
    window.print();
  };

  const getDocumentIcon = (docType: string) => {
    switch (docType) {
      case 'terms': return <File />;
      case 'privacy': return <Lock />;
      case 'cookies': return <Cookie />;
      case 'disclaimer': return <AlertTriangle />;
      case 'compliance': return <ShieldCheck />;
      default: return <FileText />;
    }
  };

  const breadcrumbs = [
    { name: t("home"), href: "/" },
    { name: t("legal"), href: "/legal" },
    { name: title, href: `/${type}` }
  ];

  return (
    <section>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={item.href}>
              {index > 0 && <span>/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-foreground">{item.name}</span>
              ) : (
                <Link 
                  href={item.href} 
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Link href="/legal">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("backToLegal")}
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getDocumentIcon(type)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground">
                      {title}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      {t(`${type}Description`)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {t("lastUpdated")}: 
                    </span>
                    <span className="font-medium">
                      {formatDate(new Date(lastUpdated))}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {t("version")}:
                    </span>
                    <Badge variant="outline">{version}</Badge>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                >
                  <Printer className="h-4 w-4 mr-1" />
                  {t("print")}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                >
                  <Download className="h-4 w-4 mr-1" />
                  {t("download")}
                </Button>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            {/* Important Notice */}
            <div className="bg-muted/50 rounded-lg p-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="text-warning text-lg">⚠️</div>
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    {t("importantNotice")}
                  </p>
                  <p className="text-muted-foreground">
                    {t("legalNoticeText")}
                  </p>
                </div>
              </div>
            </div>

            {/* Document Content */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              {children}
            </div>

            <Separator className="my-8" />

            {/* Contact Information */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-3">
                {t("questionsContact")}
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  {t("contactInstructions")}
                </p>
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/contact"
                    className="text-primary hover:underline flex items-center"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {t("contactUs")}
                  </Link>
                  <a 
                    href="mailto:legal@researchethics.com"
                    className="text-primary hover:underline"
                  >
                    legal@researchethics.com
                  </a>
                </div>
              </div>
            </div>

            {/* Document History */}
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="font-medium text-foreground mb-3">
                {t("documentHistory")}
              </h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>{t("version")} {version} - {formatDate(new Date(lastUpdated))}</p>
                <p>{t("effectiveDate")}: {formatDate(new Date(lastUpdated))}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Documents */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">{t("relatedDocuments")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: 'terms', title: t("termsOfService"), href: '/terms' },
              { type: 'privacy', title: t("privacyPolicy"), href: '/privacy' },
              { type: 'cookies', title: t("cookiePolicy"), href: '/cookies' },
              { type: 'disclaimer', title: t("disclaimer"), href: '/disclaimer' },
              { type: 'compliance', title: t("compliance"), href: '/compliance' }
            ].filter(doc => doc.type !== type).map((doc) => (
              <Link key={doc.type} href={doc.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">
                        {getDocumentIcon(doc.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-foreground">
                          {doc.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t(`${doc.type}Description`)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}