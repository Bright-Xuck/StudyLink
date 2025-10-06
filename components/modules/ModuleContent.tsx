'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Play, FileText, Download, Book, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Lesson {
  title: string;
  description: string;
  type: 'video' | 'reading' | 'document' | 'quiz';
  content: string;
  duration: number;
  order: number;
  isPreview: boolean;
}

interface ModuleContentProps {
  lessons: Lesson[];
}

// Paginated Content Component
function PaginatedContent({ content, wordsPerPage = 250 }: { content: string; wordsPerPage?: number }) {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = useMemo(() => {
    const words = content.split(/\s+/);
    const pageArray = [];
    
    for (let i = 0; i < words.length; i += wordsPerPage) {
      const pageWords = words.slice(i, i + wordsPerPage);
      pageArray.push(pageWords.join(' '));
    }
    
    return pageArray;
  }, [content, wordsPerPage]);

  const totalPages = pages.length;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Content Display */}
      <div className="prose prose-sm max-w-none mb-8 min-h-[400px] text-foreground">
        {pages[currentPage]}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage === 0
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        <div className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {totalPages}
        </div>

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage === totalPages - 1
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
        >
          Next
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

export default function ModuleContent({ lessons }: ModuleContentProps) {
  const t = useTranslations('module');
  const router = useRouter();
  const searchParams = useSearchParams();

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-6 w-6 text-primary" />;
      case 'reading':
        return <Book className="h-6 w-6 text-accent-foreground" />;
      case 'document':
        return <Download className="h-6 w-6 text-secondary-foreground" />;
      case 'quiz':
        return <FileText className="h-6 w-6 text-primary" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-primary/10';
      case 'reading':
        return 'bg-accent';
      case 'document':
        return 'bg-secondary';
      case 'quiz':
        return 'bg-primary/10';
      default:
        return 'bg-muted';
    }
  };

  const handleLesson = (lesson: Lesson) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("lesson", lesson.order.toString());
    router.push(`?${newSearchParams.toString()}`);
  };

  const lessonParam = searchParams.toString()
    ? new URLSearchParams(searchParams.toString()).get('lesson')
    : null;

  const selectedLesson = lessonParam
    ? lessons.find(l => l.order.toString() === lessonParam)
    : null;

  return (
    <div id="module-content" className="bg-card rounded-xl p-8 border border-border">
      {selectedLesson ? (
        <>
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors"
            >
              {t('backToModules')}
            </button>
            <h2 className="text-2xl font-bold text-foreground">
              {t('lesson')} {selectedLesson.order}: {selectedLesson.title}
            </h2>
          </div>
          
          {/* Use Paginated Content Component */}
          <PaginatedContent content={selectedLesson.content} wordsPerPage={250} />
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {t('moduleContent')}
          </h2>

          {/* Lessons List */}
          {lessons.length > 0 ? (
            <div className="space-y-6">
              {lessons.map((lesson, index) => (
                <div
                  onClick={() => handleLesson(lesson)}
                  key={index}
                  className="border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${getIconBg(lesson.type)} p-3 rounded-lg`}>
                      {getIcon(lesson.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {t('lesson')} {lesson.order}: {lesson.title}
                      </h3>
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Content coming soon...
              </p>
            </div>
          )}

          {/* Quiz Button */}
          {lessons.length > 0 && (
            <div className="mt-8 p-6 bg-muted rounded-lg text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('readyForQuiz')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('testKnowledge')}
              </p>
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
                {t('startQuiz')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}