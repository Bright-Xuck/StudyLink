"use client";

import { updateLessonTime } from "../../lib/actions/progress.actions";
import { ChevronLeft, ChevronRight, Clock, Download, FileText, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

// Dynamically import react-pdf to avoid SSR issues with DOMMatrix
const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
);

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  import('react-pdf').then((pdfjs) => {
    pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.js`;
  });
}

const pdfOptions = {
  cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
};

export default function DocumentContent({
  url,
  courseId,
  moduleId,
  lessonOrder,
  onContentCompleteAction,
  onViewedChangeAction,
}: {
  url: string;
  courseId: string;
  moduleId: string;
  lessonOrder: number;
  onContentCompleteAction: (lessonOrder: number) => void;
  onViewedChangeAction?: (hasViewed: boolean) => void;
}) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [timeSpent, setTimeSpent] = useState(0);
  const [pagesViewed, setPagesViewed] = useState<Set<number>>(new Set([1]));
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations("module");

  // Get file extension
  const fileExtension = url.split('.').pop()?.toLowerCase();
  const isPDF = fileExtension === 'pdf';

  // Track time spent
  useEffect(() => {
    timeIntervalRef.current = setInterval(() => {
      setTimeSpent((prev) => {
        const newTime = prev + 1;
        if (newTime % 5 === 0) {
          updateLessonTime(courseId, moduleId, lessonOrder, 5).catch(console.error);
        }
        return newTime;
      });
    }, 60000);

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
      if (timeSpent % 5 !== 0) {
        updateLessonTime(courseId, moduleId, lessonOrder, timeSpent % 5).catch(
          console.error
        );
      }
    };
  }, [courseId, moduleId, lessonOrder, timeSpent]);

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

  // Auto-trigger quiz when document is viewed enough
  useEffect(() => {
    if (hasViewedEnough) {
      onViewedChangeAction?.(true);
      onContentCompleteAction(lessonOrder);
    }
  }, [hasViewedEnough, lessonOrder, onContentCompleteAction, onViewedChangeAction]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-400px)] overflow-y-auto">
      {/* Time Tracker & Actions */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-4 flex-shrink-0">
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
        </div>
      </div>

      {/* PDF Viewer */}
      {isPDF ? (
        <div className="flex-1 overflow-y-auto">
          <div className="bg-muted rounded-lg p-4 mb-4">
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
            <div className="mb-4 p-4 bg-muted/50 rounded-lg">
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

          {/* PDF Navigation Controls - Sticky at bottom */}
          <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm flex items-center justify-between border-t border-border pt-4 pb-2 flex-shrink-0">
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
              onClick={goToNextPage}
              disabled={currentPage === numPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === numPages
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {t("next")}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      ) : (
        /* Non-PDF Documents */
        <div className="bg-muted rounded-lg p-12 text-center flex-1 flex flex-col items-center justify-center">
          <div className="bg-background rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {url.split('/').pop()}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t("documentPreviewNotAvailable")}
          </p>
          <button
            onClick={handleDownload}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            {t("downloadDocument")}
          </button>
        </div>
      )}
    </div>
  );
}