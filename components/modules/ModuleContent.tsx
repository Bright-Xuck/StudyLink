"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Play,
  FileText,
  Download,
  Book,
  CheckCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import PaginatedContent from "../content/PaginatedContent";
import VideoContent from "../content/VideoContent";
import DocumentContent from "../content/DocumentContent";
<<<<<<< Updated upstream
=======
import QuizContainer from "../quiz/quizcontainer";
import { getQuizByLessonId } from "@/lib/actions/quiz.actions";
import { toast } from "sonner";
>>>>>>> Stashed changes

interface Lesson {
  title: string;
  description: string;
  type: "video" | "reading" | "document" | "quiz";
  content: string;
  duration: number;
  order: number;
  isPreview: boolean;
}

interface LessonProgress {
  lessonOrder: number;
  completed: boolean;
  completedAt?: string;
  timeSpent: number;
}

interface ModuleContentProps {
  lessons: Lesson[];
  moduleId: string;
  progress?: {
    lessonsProgress: LessonProgress[];
    progressPercentage: number;
  } | null;
}

export default function ModuleContent({
  lessons,
  moduleId,
  progress,
}: ModuleContentProps) {
  const t = useTranslations("module");
  const router = useRouter();
  const searchParams = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [localProgress, setLocalProgress] = useState(progress);

  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-6 w-6 text-primary" />;
      case "reading":
        return <Book className="h-6 w-6 text-accent-foreground" />;
      case "document":
        return <Download className="h-6 w-6 text-secondary-foreground" />;
      case "quiz":
        return <FileText className="h-6 w-6 text-primary" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "video":
        return "bg-primary/10";
      case "reading":
        return "bg-accent";
      case "document":
        return "bg-secondary";
      case "quiz":
        return "bg-primary/10";
      default:
        return "bg-muted";
    }
  };

  const isLessonCompleted = (lessonOrder: number) => {
    return localProgress?.lessonsProgress.some(
      (lp) => lp.lessonOrder === lessonOrder && lp.completed
    );
  };

  const handleLesson = (lesson: Lesson) => {
    const currentPath = window.location.pathname;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("lesson", lesson.order.toString());
    const newUrl = `${currentPath}?${newSearchParams.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const handleLessonComplete = () => {
    // Refresh to get updated progress
    router.refresh();
  };

  const lessonParam = searchParams.toString()
    ? new URLSearchParams(searchParams.toString()).get("lesson")
    : null;

  const selectedLesson = lessonParam
    ? lessons.find((l) => l.order.toString() === lessonParam)
    : null;

  const hasNextLesson = () => {
    if (!selectedLesson) return false;
    const currentIndex = lessons.findIndex(
      (l) => l.order === selectedLesson.order
    );
    return currentIndex < lessons.length - 1;
  };

  const nextLesson = () => {
    if (!selectedLesson) return;

    const currentIndex = lessons.findIndex(
      (l) => l.order === selectedLesson.order
    );
    const nextLessonItem = lessons[currentIndex + 1];

    if (nextLessonItem) {
      handleLesson(nextLessonItem);
    }
  };

  return (
    <div
      id="module-content"
      className="bg-card rounded-xl p-8 border border-border"
    >
      {selectedLesson ? (
        <>
          <div className="flex flex-col justify-center items-start w-full gap-4 mb-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">
                {t("lesson")} {selectedLesson.order}: {selectedLesson.title}
              </h2>
              {isLessonCompleted(selectedLesson.order) && (
                <div className="flex items-center gap-2 text-accent mt-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">{t("completed")}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => router.back()}
              className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors"
            >
              {t("backToModules")}
            </button>
            
          </div>

          {selectedLesson.type === "video" ? (
            <>
              {/* Video Player */}
              <VideoContent
                url={selectedLesson.content}
                moduleId={moduleId}
                lessonOrder={selectedLesson.order}
                lessonCompleted={!!isLessonCompleted(selectedLesson.order)}
                onComplete={handleLessonComplete}
                hasNextLesson={hasNextLesson()}
                onNextLesson={nextLesson}
              />
            </>
          ) : selectedLesson.type === "document" ? (
            <>
              {/* Paginated Content */}
              <DocumentContent
                url={selectedLesson.content}
                moduleId={moduleId}
                lessonOrder={selectedLesson.order}
                lessonCompleted={!!isLessonCompleted(selectedLesson.order)}
                onCompleteAction={handleLessonComplete}
                hasNextLesson={hasNextLesson()}
                onNextLessonAction={nextLesson}
              />
            </>
          ) : selectedLesson.type === "reading" ? (
            <>
              {/* Paginated Content */}
              <PaginatedContent
                content={selectedLesson.content}
                wordsPerPage={250}
                moduleId={moduleId}
                lessonOrder={selectedLesson.order}
                lessonCompleted={!!isLessonCompleted(selectedLesson.order)}
                onCompleteAction={handleLessonComplete}
                hasNextLesson={hasNextLesson()}
                onNextLessonAction={nextLesson}
              />
            </>
          ) : (
            <>
              {/* Other Content */}
              <div>
                {selectedLesson.content}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {/* Progress Overview */}
          {localProgress && (
            <div className="mb-8 bg-muted rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {t("yourProgress")}
                </h3>
                <span className="text-2xl font-bold text-primary">
                  {localProgress.progressPercentage}%
                </span>
              </div>
              <div className="bg-background rounded-full h-3 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${localProgress.progressPercentage}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {
                  localProgress.lessonsProgress.filter((lp) => lp.completed)
                    .length
                }{" "}
                {t("of")} {lessons.length} {t("lessonsCompleted")}
              </p>
            </div>
          )}

          <h2 className="text-2xl font-bold text-foreground mb-6">
            {t("moduleContent")}
          </h2>

          {/* Lessons List */}
          {lessons.length > 0 ? (
            <div className="space-y-6">
              {lessons.map((lesson, index) => {
                const completed = isLessonCompleted(lesson.order);
                return (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLesson(lesson);
                    }}
                    key={index}
                    className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                      completed
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`${getIconBg(lesson.type)} p-3 rounded-lg`}
                      >
                        {getIcon(lesson.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {t("lesson")} {lesson.order}: {lesson.title}
                          </h3>
                          {completed && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {lesson.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {lesson.duration} min
                          </span>
                          {lesson.isPreview && (
                            <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-medium">
                              Preview
                            </span>
                          )}
                          {completed && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                              {t("completed")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t("contentComingSoon")}</p>
            </div>
          )}

          {/* Quiz Button */}
          {lessons.length > 0 && (
            <div className="mt-8 p-6 bg-muted rounded-lg text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("readyForQuiz")}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("testKnowledge")}
              </p>
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
                {t("startQuiz")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}