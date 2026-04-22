'use client';

import { Link } from '@/navigation';
import { Card, CardContent, Badge, Button, ProgressBar } from '@/components/ui';
import { BookOpen, Users, Clock } from 'lucide-react';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  students: number;
  duration?: string;
  progress?: number;
  enrolled?: boolean;
  image?: string;
  onEnroll?: () => void;
}

const levelVariants = {
  Beginner: 'success',
  Intermediate: 'warning',
  Advanced: 'error',
} as const;

export function CourseCard({
  id,
  title,
  description,
  instructor,
  level,
  lessons,
  students,
  duration = '6 hours',
  progress,
  enrolled = false,
  image,
  onEnroll,
}: CourseCardProps) {
  return (
    <Card hover className="flex flex-col h-full overflow-hidden" padding="none">
      {/* Thumbnail */}
      <div className="relative h-40 bg-[var(--color-primary)] flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <BookOpen size={48} className="text-[var(--color-primary-foreground)] opacity-30" />
        )}
        <Badge
          variant={levelVariants[level]}
          size="sm"
          className="absolute top-3 right-3"
        >
          {level}
        </Badge>
      </div>

      <CardContent className="flex-1 flex flex-col p-5">
        {/* Title & Description */}
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--color-foreground)] mb-1 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-[var(--color-foreground-muted)] mb-3 line-clamp-2">
            {description}
          </p>
          <p className="text-sm text-[var(--color-foreground)]">
            By <span className="font-medium">{instructor}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 text-xs text-[var(--color-foreground-muted)]">
          <span className="flex items-center gap-1">
            <BookOpen size={14} />
            {lessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {students.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {duration}
          </span>
        </div>

        {/* Progress or CTA */}
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
          {enrolled && progress !== undefined ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-foreground-muted)]">Progress</span>
                <span className="font-medium text-[var(--color-foreground)]">{progress}%</span>
              </div>
              <ProgressBar value={progress} size="sm" />
              <Button
                variant="primary"
                size="sm"
                fullWidth
                href={`/courses/${id}`}
              >
                Continue Learning
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                href={`/courses/${id}`}
              >
                View Details
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={onEnroll}
              >
                Enroll
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
