"use client";

import { updateLessonTime, markLessonComplete } from "../../lib/actions/progress.actions";
import { useRouter } from "next/navigation";
import { Clock, CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VideoContentProps {
  url: string;
  courseId: string;
  moduleId: string;
  lessonOrder: number;
  lessonCompleted?: boolean;
  onContentCompleteAction?: (lessonOrder: number) => void;
  onWatchedChange?: (hasWatched: boolean) => void;
  onLocalMarkComplete?: (lessonOrder: number) => void;
  quizReadyForLesson?: number | null;
  quizPassedForLesson?: number | null;
  onTakeQuiz?: () => void;
  hasNextLesson?: boolean;
  nextModuleSlug?: string;
  onNextLesson?: () => void;
  onComplete?: () => void; // parent refresh
}

export default function VideoContent({
  url,
  moduleId,
  courseId,
  lessonOrder,
  onWatchedChange,
  onLocalMarkComplete,
  hasNextLesson,
  onNextLesson,
  onComplete,
}: VideoContentProps) {
  const [timeSpent, setTimeSpent] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasWatched, setHasWatched] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(false);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<React.ElementRef<typeof ReactPlayer> | null>(null);
  const t = useTranslations("module");

  // Track time spent watching
  useEffect(() => {
    timeIntervalRef.current = setInterval(() => {
      setTimeSpent((prev) => {
        const newTime = prev + 1;
        if (newTime % 5 === 0) {
          updateLessonTime(courseId, moduleId, lessonOrder, 5).catch(
            console.error
          );
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

  return (
    <div className="w-full">
      {/* Time Tracker */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {t("timeSpent")}: {timeSpent} {t("minutes")}
          </span>
        </div>
      </div>

      {/* Video Player - Responsive Container */}
      <div
        className="relative w-full bg-black rounded-lg overflow-hidden mb-4"
        style={{ paddingTop: "56.25%" }}
      >
        <div className="absolute top-0 left-0 w-full h-full">
          <ReactPlayer
            ref={playerRef}
            src={url}
            width="100%"
            height="100%"
            controls={true}
            playing={false}
          />
        </div>
      </div>

      {/* Complete Lesson Button */}
      <div className="mt-4">
        <Button
          onClick={async () => {
            try {
              setLoadingComplete(true);
              setHasWatched(true);
              onWatchedChange?.(true);
              setLocalCompleted(true);
              onLocalMarkComplete?.(lessonOrder);

              // Mark lesson as complete
              await markLessonComplete(courseId, moduleId, lessonOrder, 0);
              toast.success(t("lessonMarkedComplete"));
              onComplete?.();
            } catch (error) {
              console.error("Error marking lesson complete:", error);
              toast.error(t("errorMarkingComplete"));
            } finally {
              setLoadingComplete(false);
            }
          }}
          disabled={loadingComplete}
          className="w-full"
          size="lg"
        >
          {loadingComplete ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              {t("loading")}
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              {t("completeLesson")}
            </>
          )}
        </Button>

        {/* Next Lesson Button - Only show if there's a next lesson within this module */}
        {localCompleted && hasNextLesson && (
          <div className="mt-3">
            <Button onClick={() => onNextLesson?.()} className="w-full" size="lg">
              {t("nextLesson")}
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
