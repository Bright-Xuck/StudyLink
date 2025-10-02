'use client';

import { useTranslations } from 'next-intl';
import { Play, FileText, Download, Book } from 'lucide-react';

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

export default function ModuleContent({ lessons }: ModuleContentProps) {
  const t = useTranslations('module');

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

  return (
    <div id="module-content" className="bg-card rounded-xl p-8 border border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {t('moduleContent')}
      </h2>

      {/* Lessons List */}
      {lessons.length > 0 ? (
        <div className="space-y-6">
          {lessons.map((lesson, index) => (
            <div
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
    </div>
  );
}