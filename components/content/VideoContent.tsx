"use client";

import { toast } from "sonner";
import { markLessonComplete, updateLessonTime } from "../../lib/actions/progress.actions";
import { CheckCircle, ChevronRight, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";

interface VideoContentProps {
  url: string;
  moduleId: string;
  lessonOrder: number;
  lessonCompleted: boolean;
  onComplete: () => void;
  hasNextLesson: boolean;
  onNextLesson: () => void;
}

export default function VideoContent({
  url,
  moduleId,
  lessonOrder,
  lessonCompleted,
  onComplete,
  hasNextLesson,
  onNextLesson,
}: VideoContentProps) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [hasWatched, setHasWatched] = useState(false);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<React.ElementRef<typeof ReactPlayer> | null>(null);
  const t = useTranslations("module");
  const router = useRouter();


  // Track time spent watching
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

  const handleCompleteLesson = async () => {
    const result = await markLessonComplete(moduleId, lessonOrder, timeSpent);
    if (result.success && "message" in result) {
      toast.success(result.message);
      onComplete();
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

  // Use a more type-safe approach for progress handling
  const handleProgress = (progressState: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    // Mark as watched if user has watched at least 80% of the video
    if (progressState.played > 0.8 && !hasWatched) {
      setHasWatched(true);
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
        {!lessonCompleted && hasWatched && (
          <button
            onClick={handleCompleteLesson}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            {t("markComplete")}
          </button>
        )}
      </div>

      {/* Video Player */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
        <ReactPlayer
            ref={playerRef}
            src={url}
            width="100%"
            height="100%"
            style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
            controls
            playing={false}
            onProgress={() => handleProgress}
            config={{
              youtube: {
                rel: 0,
                color: "white",
              },
            }}
        />
      </div>

      {/* Watch Progress Indicator */}
      {!hasWatched && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            {t("watchVideoToComplete")}
          </p>
        </div>
      )}

      {/* Navigation */}
      {hasNextLesson && (
        <div className="flex justify-end">
          <button
            onClick={onNextLesson}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 transition-colors"
          >
            {t("nextLesson")}
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}