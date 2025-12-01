"use client";

import { updateLessonTime } from "../../lib/actions/progress.actions";
import { Clock, CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";

interface VideoContentProps {
  url: string;
  courseId: string;
  moduleId: string;
  lessonOrder: number;
  onContentCompleteAction: (lessonOrder: number) => void;
  onWatchedChange?: (hasWatched: boolean) => void;
}

export default function VideoContent({
  url,
  moduleId,
  courseId,
  lessonOrder,
  onContentCompleteAction,
  onWatchedChange,
}: VideoContentProps) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [hasWatched, setHasWatched] = useState(false);
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
          onClick={() => {
            setHasWatched(true);
            onWatchedChange?.(true);
            onContentCompleteAction(lessonOrder);
          }}
          className="w-full"
          size="lg"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          {t("completeLesson")}
        </Button>
      </div>
    </div>
  );
}
