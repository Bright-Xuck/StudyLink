'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  students: number;
  image?: string;
  onEnroll?: () => void;
}

export function CourseCard({
  id,
  title,
  description,
  instructor,
  level,
  lessons,
  students,
  image,
  onEnroll,
}: CourseCardProps) {
  const levelColors = {
    Beginner: 'default',
    Intermediate: 'secondary',
    Advanced: 'accent',
  } as const;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      {image && (
        <div
          className="w-full h-40 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-t-lg"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant={levelColors[level]}>{level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-[var(--color-foreground-muted)] mb-3">{description}</p>
        <p className="text-sm font-medium text-[var(--color-foreground)] mb-4">By {instructor}</p>
        <div className="flex gap-4 text-xs text-[var(--color-foreground-muted)]">
          <span>{lessons} Lessons</span>
          <span>{students} Students</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="primary" size="sm" className="w-full" onClick={onEnroll}>
          Enroll
        </Button>
      </CardFooter>
    </Card>
  );
}
