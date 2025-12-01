"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  updateLessonTime,
} from "@/lib/actions/progress.actions";


export default function PaginatedContent({
  content,
  wordsPerPage = 250,
  moduleId,
  courseId,
  lessonOrder,
  onContentCompleteAction,
  onReadChangeAction,
}: {
  content: string;
  wordsPerPage?: number;
  moduleId: string;
  courseId: string;
  lessonOrder: number;
  onContentCompleteAction: (lessonOrder: number) => void;
  onReadChangeAction?: (isLastPage: boolean, currentPage: number, totalPages: number) => void;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations("module");

  // Reset to first page when lesson changes
  useEffect(() => {
    setCurrentPage(0);
    setTimeSpent(0);
  }, [lessonOrder]);

  // Track time spent on lesson
  useEffect(() => {
    // Update time every minute
    timeIntervalRef.current = setInterval(() => {
      setTimeSpent((prev) => {
        const newTime = prev + 1;
        // Update backend every 5 minutes
        if (newTime % 5 === 0) {
          updateLessonTime(courseId, moduleId, lessonOrder, 5).catch(console.error);
        }
        return newTime;
      });
    }, 60000); // Every minute

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
      // Save remaining time on unmount
      if (timeSpent % 5 !== 0) {
        updateLessonTime(courseId, moduleId, lessonOrder, timeSpent % 5).catch(
          console.error
        );
      }
    };
  }, [courseId, moduleId, lessonOrder, timeSpent]);

  const pages = useMemo(() => {
    const correctedContent = content
      .replace(/\\n/g, "\n")
      .replace(/\r\n/g, "\n")
      .trim();

    const blocks = correctedContent.split(/\n\n+/);
    const pageArray = [];
    let currentPage = "";
    let currentWordCount = 0;

    for (const block of blocks) {
      const blockWordCount = block.split(/\s+/).length;

      if (currentWordCount + blockWordCount > wordsPerPage && currentPage) {
        pageArray.push(currentPage.trim());
        currentPage = block + "\n\n";
        currentWordCount = blockWordCount;
      } else {
        currentPage += block + "\n\n";
        currentWordCount += blockWordCount;
      }
    }

    if (currentPage.trim()) {
      pageArray.push(currentPage.trim());
    }

    return pageArray.length > 0 ? pageArray : [correctedContent];
  }, [content, wordsPerPage]);

  const totalPages = pages.length;
  const isLastPage = currentPage === totalPages - 1;

  // Notify parent of page changes
  useEffect(() => {
    onReadChangeAction?.(isLastPage, currentPage, totalPages);
  }, [isLastPage, currentPage, totalPages, onReadChangeAction]);

  // Auto-trigger quiz when all pages are read
  useEffect(() => {
    if (isLastPage) {
      onContentCompleteAction(lessonOrder);
    }
  }, [isLastPage, lessonOrder, onContentCompleteAction]);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-400px)]">
      {/* Time Tracker */}
      <div className="mb-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {t("timeSpent")}: {timeSpent} {t("minutes")}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          {t("page")} {currentPage + 1} {t("of")} {totalPages}
        </div>
      </div>

      {/* Content Display - Scrollable */}
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ ...props }) => (
                <h1
                  className="text-4xl font-bold mt-8 mb-4 text-primary border-b border-border pb-2"
                  {...props}
                />
              ),
              h2: ({ ...props }) => (
                <h2
                  className="text-3xl font-semibold mt-6 mb-3 text-primary"
                  {...props}
                />
              ),
              h3: ({ ...props }) => (
                <h3
                  className="text-2xl font-semibold mt-5 mb-2 text-foreground"
                  {...props}
                />
              ),
              h4: ({ ...props }) => (
                <h4
                  className="text-xl font-medium mt-4 mb-2 text-foreground"
                  {...props}
                />
              ),
              p: ({ ...props }) => (
                <p
                  className="text-base leading-7 mb-4 text-foreground/90"
                  {...props}
                />
              ),
              ul: ({ ...props }) => (
                <ul
                  className="list-disc list-inside mb-4 space-y-2 text-foreground/90"
                  {...props}
                />
              ),
              ol: ({ ...props }) => (
                <ol
                  className="list-decimal list-inside mb-4 space-y-2 text-foreground/90"
                  {...props}
                />
              ),
              li: ({ ...props }) => <li className="ml-4" {...props} />,
              blockquote: ({ ...props }) => (
                <blockquote
                  className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
                  {...props}
                />
              ),
              code: ({
                inline,
                ...props
              }: React.ComponentPropsWithoutRef<"code"> & { inline?: boolean }) =>
                inline ? (
                  <code
                    className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary"
                    {...props}
                  />
                ) : (
                  <code
                    className="block bg-muted p-4 rounded-lg my-4 overflow-x-auto text-sm font-mono"
                    {...props}
                  />
                ),
              pre: ({ ...props }) => (
                <pre
                  className="bg-muted p-4 rounded-lg my-4 overflow-x-auto"
                  {...props}
                />
              ),
              table: (props) => (
                <div className="overflow-x-auto my-4">
                  <table
                    className="min-w-full border-collapse border border-border"
                    {...props}
                  />
                </div>
              ),
              th: ({ ...props }) => (
                <th
                  className="border border-border bg-muted px-4 py-2 text-left font-semibold"
                  {...props}
                />
              ),
              td: (props) => (
                <td className="border border-border px-4 py-2" {...props} />
              ),
              a: ({ ...props }) => (
                <a
                  className="text-primary hover:underline font-medium"
                  {...props}
                />
              ),
              strong: (props) => (
                <strong className="font-bold text-foreground" {...props} />
              ),
              em: ({ ...props }) => <em className="italic" {...props} />,
              hr: (props) => (
                <hr className="my-8 border-t border-border" {...props} />
              ),
            }}
          >
            {pages[currentPage]}
          </ReactMarkdown>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 bg-muted rounded-full h-2 overflow-hidden flex-shrink-0">
        <div
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
        />
      </div>

      {/* Page Navigation Controls - Sticky at bottom */}
      <div className="flex items-center justify-between border-t border-border pt-4 flex-shrink-0">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage === 0
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          <ChevronLeft size={20} />
          {t("previous")}
        </button>

        <button
          onClick={goToNextPage}
          disabled={isLastPage}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isLastPage
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {t("next")}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}