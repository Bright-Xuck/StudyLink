import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Lock, 
  Cookie, 
  AlertTriangle, 
  ShieldCheck,
  Scale,
  ArrowRight
} from 'lucide-react';

interface LegalPageProps {
  params: {
    locale: string;
  };
}

export default function LegalPage({ params: { locale } }: LegalPageProps) {
  const t = useTranslations('legal');

  const legalDocuments = [
    {
      type: 'terms',
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      type: 'privacy',
      icon: Lock,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent',
    },
    {
      type: 'cookies',
      icon: Cookie,
      color: 'text-secondary-foreground',
      bgColor: 'bg-secondary',
    },
    {
      type: 'disclaimer',
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      type: 'compliance',
      icon: ShieldCheck,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Scale className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t('pageTitle')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('pageSubtitle')}
          </p>
        </div>

        {/* Last Updated Notice */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">ℹ️</div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t('lastUpdatedTitle')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('lastUpdatedText')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {legalDocuments.map((doc) => {
            const Icon = doc.icon;
            return (
              <Link key={doc.type} href={`/${locale}/${doc.type}`}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${doc.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${doc.color}`} />
                    </div>
                    <CardTitle className="text-xl">
                      {t(`${doc.type}.title`)}
                    </CardTitle>
                    <CardDescription>
                      {t(`${doc.type}.description`)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
                      <span className="text-sm font-medium">
                        {t('readDocument')}
                      </span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <Separator className="my-12" />

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>{t('yourRights')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="text-primary">✓</div>
                <div className="text-sm text-foreground">
                  {t('rightAccessData')}
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-primary">✓</div>
                <div className="text-sm text-foreground">
                  {t('rightCorrectDelete')}
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-primary">✓</div>
                <div className="text-sm text-foreground">
                  {t('rightExportData')}
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-primary">✓</div>
                <div className="text-sm text-foreground">
                  {t('rightWithdrawConsent')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('contactUs')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {t('legalInquiries')}
                </p>
                <a 
                  href="mailto:legal@researchethics.com"
                  className="text-sm text-primary hover:underline"
                >
                  legal@researchethics.com
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {t('dataProtection')}
                </p>
                <a 
                  href="mailto:privacy@researchethics.com"
                  className="text-sm text-primary hover:underline"
                >
                  privacy@researchethics.com
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {t('phone')}
                </p>
                <a 
                  href="tel:+237123456789"
                  className="text-sm text-primary hover:underline"
                >
                  +237 123 456 789
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Badges */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {t('compliantWith')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline">GDPR</Badge>
            <Badge variant="outline">CCPA</Badge>
            <Badge variant="outline">POPIA</Badge>
            <Badge variant="outline">WCAG 2.1</Badge>
            <Badge variant="outline">PCI DSS</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}