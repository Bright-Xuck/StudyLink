'use client';

import { Download, Eye, Award, Calendar, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface CertificateCardProps {
  certificate: {
    _id: string;
    certificateNumber: string;
    studentName: string;
    courseName: string;
    courseNameFr: string;
    completionDate: string;
    issueDate: string;
    finalScore: number;
    totalLessons: number;
    totalQuizzes: number;
    verificationCode: string;
    courseId: {
      title: string;
      titleFr: string;
      imageUrl?: string;
    };
  };
  locale: string;
}

export default function CertificateCard({ certificate, locale }: CertificateCardProps) {
  const t = useTranslations('certificates');
  const [isDownloading, setIsDownloading] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/certificates/${certificate._id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${certificate.certificateNumber}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleView = () => {
    window.open(`/dashboard/certificates/${certificate._id}`, '_blank');
  };

  const courseName = locale === 'fr'
    ? (certificate.courseId?.titleFr || certificate.courseNameFr)
    : (certificate.courseId?.title || certificate.courseName);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-colors group">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary to-accent p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-background/20 p-3 rounded-lg">
              <Award className="h-8 w-8 text-background" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-background">
                {t('certificateOfCompletion')}
              </h3>
              <p className="text-background/80 text-sm">
                {certificate.certificateNumber}
              </p>
            </div>
          </div>
          <div className="bg-background/20 px-3 py-1.5 rounded-full">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-background" />
              <span className="text-background font-bold">{certificate.finalScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4 line-clamp-2">
          {courseName}
        </h4>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {t('completed')}: <strong className="text-foreground">{formatDate(certificate.completionDate)}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{certificate.totalLessons}</p>
              <p className="text-xs text-muted-foreground">{t('lessons')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{certificate.totalQuizzes}</p>
              <p className="text-xs text-muted-foreground">{t('quizzes')}</p>
            </div>
          </div>
        </div>

        {/* Verification Code */}
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <p className="text-xs text-muted-foreground mb-1">{t('verificationCode')}</p>
          <p className="font-mono text-sm font-bold text-foreground">{certificate.verificationCode}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleView}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            {t('view')}
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? t('downloading') : t('download')}
          </Button>
        </div>
      </div>
    </div>
  );
}
