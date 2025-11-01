// components/home/PopularModules.tsx
'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Clock, Users, TrendingUp, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Module {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  level: string;
  slug: string;
  lessonCount: number;
  enrolledCount?: number;
  isFree?: boolean;
  price?: number;
  courseName?: string;
}

interface PopularModulesProps {
  modules: Module[];
}

export default function PopularModules({ modules }: PopularModulesProps) {
  const t = useTranslations('popularModules');

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
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

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <TrendingUp className="w-4 h-4" />
            {t('trending')}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {modules.map((module) => (
            <div
              key={module._id}
              className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-border"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-muted">
                <Image
                  src={module.imageUrl}
                  alt={module.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Level Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`${getLevelColor(module.level)} px-3 py-1 rounded-full text-xs font-semibold capitalize`}
                  >
                    {module.level}
                  </span>
                </div>
                {/* Free/Premium Badge */}
                <div className="absolute top-4 right-4">
                  {module.isFree ? (
                    <span className="bg-success text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      {t('free')}
                    </span>
                  ) : (
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      {t('premium')}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Course Name */}
                <p className="text-sm text-primary font-semibold mb-2">
                  {module.courseName}
                </p>

                {/* Title */}
                <h3 className="text-xl font-bold text-card-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {module.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                  {t(module.description)}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{module.enrolledCount?.toLocaleString()}</span>
                    </div>
                  </div>
                  <span>{module.lessonCount} {t('lessons')}</span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    {module.isFree ? (
                      <span className="text-2xl font-bold text-success">
                        {t('free')}
                      </span>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-foreground">
                          {module.price?.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">XAF</span>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/modules/${module.slug}`}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2 group/btn"
                  >
                    {t('viewModule')}
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/modules"
            className="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-lg font-semibold transition-all inline-flex items-center gap-2 group"
          >
            {t('viewAllModules')}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}