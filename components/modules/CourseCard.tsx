'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Clock, BookOpen, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  department: string;
  faculty: string;
  isFree: boolean;
  price: number;
  duration: string;
  level: string;
  slug: string;
  moduleCount?: number;
}

export default function CourseCard({
  title,
  description,
  imageUrl,
  department,
  faculty,
  isFree,
  price,
  duration,
  level,
  slug,
  moduleCount = 0,
}: CourseCardProps) {
  const t = useTranslations('courses');

  const getLevelColor = (courseLevel: string) => {
    switch (courseLevel.toLowerCase()) {
      case 'beginner':
        return 'bg-secondary/20 text-secondary';
      case 'intermediate':
        return 'bg-accent/20 text-accent';
      case 'advanced':
        return 'bg-warning/20 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getLevelIcon = (courseLevel: string) => {
    switch (courseLevel.toLowerCase()) {
      case 'beginner':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'intermediate':
        return <BookOpen className="w-4 h-4" />;
      case 'advanced':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border-2 border-border hover:border-primary">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        {/* Free Badge */}
        {isFree && (
          <div className="absolute top-4 right-4">
            <span className="bg-success text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
              {t('free')}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Level Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`${getLevelColor(level)} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}
          >
            {getLevelIcon(level)}
            <span className="capitalize">{level}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed text-sm">
          {description}
        </p>

        {/* Department & Faculty */}
        <div className="mb-4 space-y-1">
          <p className="text-sm font-medium text-foreground">
            {department}
          </p>
          <p className="text-xs text-muted-foreground">
            {faculty}
          </p>
        </div>

        {/* Course Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>
              {moduleCount} {t('modules')}
            </span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            {isFree ? (
              <span className="text-2xl font-bold text-success">
                {t('free')}
              </span>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">
                  {price.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">XAF</span>
              </div>
            )}
          </div>
          <Link
            href={`/courses/${slug}`}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2 group/btn"
          >
            {t('viewCourse')}
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}