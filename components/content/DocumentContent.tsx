"use client";

import { toast } from "sonner";
import { markLessonComplete, updateLessonTime } from "../../lib/actions/progress.actions";
import { CheckCircle, ChevronLeft, ChevronRight, Clock, Download, FileText, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const pdfOptions = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
};

// Add this new component before VideoContent
export default function DocumentContent({
  url,
  moduleId,
  lessonOrder,
  lessonCompleted,
  onCompleteAction,
  hasNextLesson,
  onNextLessonAction,
}: {
  url: string;
  moduleId: string;
  lessonOrder: number;
  lessonCompleted: boolean;
  onCompleteAction: () => void;
  hasNextLesson: boolean;
  onNextLessonAction: () => void;
}) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [timeSpent, setTimeSpent] = useState(0);
  const [pagesViewed, setPagesViewed] = useState<Set<number>>(new Set([1]));
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations("module");
  const router = useRouter();

  // Get file extension
  const fileExtension = url.split('.').pop()?.toLowerCase();
  const isPDF = fileExtension === 'pdf';

  // Track time spent
  useEffect(() => {
    timeIntervalRef.current = setInterval(() => {
      setTimeSpent((prev) => {
        const newTime = prev + 1;
        if (newTime % 5 === 0) {
          updateLessonTime(moduleId, lessonOrder, 5).catch(console.error);
        }
        return newTime;
      });
    }, 60000);

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
      if (timeSpent % 5 !== 0) {
        updateLessonTime(moduleId, lessonOrder, timeSpent % 5).catch(
          console.error
        );
      }
    };
  }, [moduleId, lessonOrder, timeSpent]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setPagesViewed((prev) => new Set([...prev, nextPage]));
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Check if user has viewed at least 70% of pages
  const hasViewedEnough = numPages > 0 && pagesViewed.size >= Math.ceil(numPages * 0.7);

  const handleCompleteLesson = async () => {
    const result = await markLessonComplete(moduleId, lessonOrder, timeSpent);
    if (result.success && "message" in result) {
      toast.success(result.message);
      onCompleteAction();
    } else if ("error" in result) {
      if (
        result.error === "Not authenticated" ||
        result.error === "Non authentifié"
      ) {
        toast.error(t("pleaseLoginToComplete"));
        router.push(`/login`);
      }
      toast.error(result.error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Time Tracker & Actions */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {t("timeSpent")}: {timeSpent} {t("minutes")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t("download")}
          </button>
          {!lessonCompleted && hasViewedEnough && (
            <button
              onClick={handleCompleteLesson}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {t("markComplete")}
            </button>
          )}
        </div>
      </div>

      {/* PDF Viewer */}
      {isPDF ? (
        <>
          <div className="bg-muted rounded-lg p-4 mb-6">
            <div className="flex justify-center">
              <Document
                file={url}
                options={pdfOptions}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) => {
                  console.error('PDF Load Error:', error);
                }}
                loading={
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                }
                error={
                  <div className="text-center py-20">
                    <p className="text-destructive mb-4">{t("pdfLoadError")}</p>
                    <button
                      onClick={handleDownload}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
                    >
                      <Download className="h-4 w-4" />
                      {t("downloadInstead")}
                    </button>
                  </div>
                }
              >
                <Page
                  pageNumber={currentPage}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="mx-auto"
                  width={Math.min(800, typeof window !== 'undefined' ? window.innerWidth - 100 : 800)}
                />
              </Document>
            </div>
          </div>

          {/* Progress Indicator */}
          {!hasViewedEnough && numPages > 0 && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                {t("viewPagesToComplete", {
                  viewed: pagesViewed.size,
                  required: Math.ceil(numPages * 0.7),
                  total: numPages,
                })}
              </p>
              <div className="mt-2 bg-background rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${(pagesViewed.size / numPages) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-border pt-6">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 1
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              <ChevronLeft size={20} />
              {t("previous")}
            </button>

            <div className="text-sm text-muted-foreground">
              {t("page")} {currentPage} {t("of")} {numPages}
            </div>

            <button
              onClick={currentPage === numPages && hasNextLesson ? onNextLessonAction : goToNextPage}
              disabled={currentPage === numPages && !hasNextLesson}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === numPages && !hasNextLesson
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {currentPage === numPages && hasNextLesson ? t("nextLesson") : t("next")}
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      ) : (
        /* Non-PDF Documents */
        <div className="bg-muted rounded-lg p-12 text-center">
          <div className="bg-background rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {url.split('/').pop()}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t("documentPreviewNotAvailable")}
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleDownload}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              {t("downloadDocument")}
            </button>
            {hasNextLesson && (
              <button
                onClick={onNextLessonAction}
                className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                {t("nextLesson")}
                <ChevronRight size={20} />
              </button>
            )}
          </div>
          {!lessonCompleted && (
            <button
              onClick={handleCompleteLesson}
              className="mt-4 text-primary hover:underline flex items-center gap-2 mx-auto"
            >
              <CheckCircle className="h-4 w-4" />
              {t("markComplete")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}