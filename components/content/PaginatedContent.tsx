"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  markLessonComplete,
  updateLessonTime,
} from "@/lib/actions/progress.actions";
import { toast } from "sonner";


export default function PaginatedContent({
  content,
  wordsPerPage = 250,
  moduleId,
  lessonOrder,
  lessonCompleted,
  onCompleteAction,
  hasNextLesson,
  onNextLessonAction,
}: {
  content: string;
  wordsPerPage?: number;
  moduleId: string;
  lessonOrder: number;
  lessonCompleted: boolean;
  onCompleteAction: () => void;
  hasNextLesson: boolean;
  onNextLessonAction: () => void;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations("module");
  const router = useRouter();

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
          updateLessonTime(moduleId, lessonOrder, 5).catch(console.error);
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
        updateLessonTime(moduleId, lessonOrder, timeSpent % 5).catch(
          console.error
        );
      }
    };
  }, [moduleId, lessonOrder, timeSpent]);

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

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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

  const handleNextAction = () => {
    if (isLastPage && hasNextLesson) {
      // Go to next lesson
      onNextLessonAction();
    } else {
      // Go to next page
      goToNextPage();
    }
  };

  return (
    <div>
      {/* Time Tracker */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {t("timeSpent")}: {timeSpent} {t("minutes")}
          </span>
        </div>
        {!lessonCompleted && isLastPage && (
          <button
            onClick={handleCompleteLesson}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            {t("markComplete")}
          </button>
        )}
      </div>

      {/* Content Display */}
      <div className="prose prose-slate dark:prose-invert max-w-none mb-8 min-h-[400px]">
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

      {/* Navigation Controls */}
      <div className="flex items-center justify-between border-t border-border pt-6">
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

        <div className="text-sm text-muted-foreground">
          {t("page")} {currentPage + 1} {t("of")} {totalPages}
        </div>

        <button
          onClick={handleNextAction}
          disabled={isLastPage && !hasNextLesson}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isLastPage && !hasNextLesson
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {isLastPage && hasNextLesson ? t("nextLesson") : t("next")}
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
        />
      </div>
    </div>
  );
}