"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Play,
  FileText,
  Download,
  Book,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import PaginatedContent from "../content/PaginatedContent";
import VideoContent from "../content/VideoContent";
import DocumentContent from "../content/DocumentContent";
import QuizContainer from "../quiz-questions/QuizContainer";
import { getQuizByLessonId } from "@/lib/actions/quiz.actions";
import { toast } from "sonner";

interface Lesson {
  _id: string; // MongoDB ID
  title: string;
  description: string;
  type: "video" | "reading" | "document" | "quiz";
  content: string;
  duration: number;
  order: number;
  isPreview: boolean;
  hasQuiz?: boolean; // NEW - indicates if lesson has a quiz
}

interface LessonProgress {
  moduleId: string;
  lessonOrder: number;
  completed: boolean;
  completedAt?: string;
  timeSpent: number;
  quizPassed?: boolean; // NEW - track if quiz passed
}

interface ModuleProgress {
  moduleId: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  completed: boolean;
}

interface ModuleContentProps {
  lessons: Lesson[];
  moduleId: string;
  courseId: string; // NEW - Required for quiz progress tracking
  userId: string;
  progress?: {
    lessonsProgress: LessonProgress[];
    modulesProgress?: ModuleProgress[];
    progressPercentage: number;
  } | null;
}

export default function ModuleContent({
  lessons,
  moduleId,
  courseId,
  progress,
}: ModuleContentProps) {
  const t = useTranslations("module");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localProgress] = useState(progress);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

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
      (lp) => lp.moduleId === moduleId && lp.lessonOrder === lessonOrder && lp.completed
    );
  };

  const isQuizPassed = (lessonOrder: number) => {
    return localProgress?.lessonsProgress.some(
      (lp) => lp.moduleId === moduleId && lp.lessonOrder === lessonOrder && lp.quizPassed
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

  const handleTakeQuiz = async (lesson: Lesson) => {
    setLoadingQuiz(true);
    setCurrentLesson(lesson);

    try {
      // Fetch quiz for this lesson
      const quiz = await getQuizByLessonId(lesson._id);

      if (!quiz) {
        toast.error(t("noQuizForLesson"));
        setLoadingQuiz(false);
        setCurrentLesson(null);
        return;
      }

      setQuizId(quiz._id);
      setShowQuiz(true);
    } catch (error) {
      console.error("Error loading quiz:", error);
      toast.error(t("quizLoadError"));
      setCurrentLesson(null);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    setCurrentLesson(null);
    setQuizId(null);
    // Refresh to update any quiz-related progress
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
              <div className="flex items-center gap-3 mt-2">
                {isLessonCompleted(selectedLesson.order) && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">{t("completed")}</span>
                  </div>
                )}
                {isQuizPassed(selectedLesson.order) && (
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">{t("quizPassed")}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors"
              >
                {t("backToModules")}
              </button>
              
              {/* Quiz Button for Current Lesson */}
              {selectedLesson.hasQuiz !== false && (
                <button
                  onClick={() => handleTakeQuiz(selectedLesson)}
                  disabled={loadingQuiz}
                  className="bg-primary text-primary-foreground hover:opacity-90 px-6 py-2 rounded-lg transition-opacity font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingQuiz ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("loading")}
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      {isQuizPassed(selectedLesson.order) ? t("retakeQuiz") : t("takeQuiz")}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {selectedLesson.type === "video" ? (
            <VideoContent
              url={selectedLesson.content}
              courseId={courseId}
              moduleId={moduleId}
              lessonOrder={selectedLesson.order}
              lessonCompleted={!!isLessonCompleted(selectedLesson.order)}
              onComplete={handleLessonComplete}
              hasNextLesson={hasNextLesson()}
              onNextLesson={nextLesson}
            />
          ) : selectedLesson.type === "document" ? (
            <DocumentContent
              url={selectedLesson.content}
              courseId={courseId}
              moduleId={moduleId}
              lessonOrder={selectedLesson.order}
              lessonCompleted={!!isLessonCompleted(selectedLesson.order)}
              onCompleteAction={handleLessonComplete}
              hasNextLesson={hasNextLesson()}
              onNextLessonAction={nextLesson}
            />
          ) : selectedLesson.type === "reading" ? (
            <PaginatedContent
              content={selectedLesson.content}
              wordsPerPage={250}
              courseId={courseId}
              moduleId={moduleId}
              lessonOrder={selectedLesson.order}
              lessonCompleted={!!isLessonCompleted(selectedLesson.order)}
              onCompleteAction={handleLessonComplete}
              hasNextLesson={hasNextLesson()}
              onNextLessonAction={nextLesson}
            />
          ) : (
            <div>
              {selectedLesson.content}
            </div>
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
                  localProgress.lessonsProgress.filter(
                    (lp) => lp.moduleId === moduleId && lp.completed
                  ).length
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
                const quizPassed = isQuizPassed(lesson.order);
                const hasQuiz = lesson.hasQuiz !== false; // Assume has quiz unless explicitly false
                
                return (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 transition-colors ${
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
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          {quizPassed && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {lesson.description}
                        </p>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs text-muted-foreground">
                            {lesson.duration} min
                          </span>
                          {lesson.isPreview && (
                            <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-medium">
                              Preview
                            </span>
                          )}
                          {completed && (
                            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-0.5 rounded-full font-medium">
                              {t("completed")}
                            </span>
                          )}
                          {quizPassed && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                              {t("quizPassed")}
                            </span>
                          )}
                          {hasQuiz && !quizPassed && (
                            <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 px-2 py-0.5 rounded-full font-medium">
                              {t("hasQuiz")}
                            </span>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLesson(lesson);
                            }}
                            className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                          >
                            {completed ? t("reviewLesson") : t("startLesson")}
                          </button>
                          
                          {/* Show quiz button if lesson has a quiz */}
                          {hasQuiz && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleTakeQuiz(lesson);
                              }}
                              disabled={loadingQuiz}
                              className={`px-4 py-1.5 rounded-lg transition-colors text-sm font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                                quizPassed
                                  ? "bg-primary/20 text-primary hover:bg-primary/30"
                                  : "bg-primary/10 text-primary hover:bg-primary/20"
                              }`}
                            >
                              {loadingQuiz ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <FileText className="h-3.5 w-3.5" />
                              )}
                              {quizPassed ? t("retakeQuiz") : t("takeQuiz")}
                            </button>
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
        </>
      )}

      {/* Quiz Modal */}
      {showQuiz && quizId && currentLesson && (
        <QuizContainer
          quizId={quizId}
          courseId={courseId}
          moduleId={moduleId}
          lessonOrder={currentLesson.order}
          onClose={handleCloseQuiz}
        />
      )}
    </div>
  );
}