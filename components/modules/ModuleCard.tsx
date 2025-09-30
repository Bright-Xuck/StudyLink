'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';
import Image from 'next/image'; // Import next/image
import { formatPrice, formatTime } from '@/lib/utils';

interface ModuleCardProps {
  id: string; 
  title: string;
  description: string;
  imageUrl: string;
  isFree: boolean;
  price?: number;
  slug: string;
  updatedAt?: Date; 
}

export default function ModuleCard({
    title,
    description,
    imageUrl,
    isFree,
    price,
    slug,
    updatedAt, 
}: ModuleCardProps) {
  const t = useTranslations('courses');


  const formattedTime = updatedAt ? formatTime(updatedAt) : ""


  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-border">
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
        {/* Badge */}
        <div className="absolute top-4 right-4">
          {isFree ? (
            <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
              {t('free')}
            </span>
          ) : (
            <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Lock className="h-3 w-3" />
              {t('paid')}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-card-foreground mb-3 line-clamp-2">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
          {description}
        </p>
        {formattedTime && (
          <p className="text-sm text-muted-foreground mb-4">
            {t('updatedAt')}: {formattedTime}
          </p>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            {isFree ? (
              <span className="text-2xl font-bold text-accent-foreground">
                {t('free')}
              </span>
            ) : (
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(price || 0)}
              </span>
            )}
          </div>
          <Link
            href={`/modules/${slug}`}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2 group/btn"
          >
            {t('learnMore')}
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}