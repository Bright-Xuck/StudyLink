'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

export function Hero() {
  const t = useTranslations('landing');

  return (
    <section className="relative overflow-hidden bg-[var(--color-primary)] text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <GridPattern />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <span className="inline-block px-4 py-2 bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-full text-sm font-medium">
              {t('hero_subtitle')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              {t('hero_title')}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="lg" href="/courses">
                {t('hero_cta')}
              </Button>
              <Button variant="outline" size="lg" href="/">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-slate-700">
              <Stat value="10K+" label="Students" />
              <Stat value="50+" label="Courses" />
              <Stat value="95%" label="Satisfaction" />
            </div>
          </div>

          {/* Illustration */}
          <div className="hidden md:block">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl md:text-3xl font-bold">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

function GridPattern() {
  return (
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="200" r="150" fill="url(#heroGradient)" opacity="0.1" />
      <circle cx="200" cy="200" r="100" fill="url(#heroGradient)" opacity="0.2" />
      <rect x="120" y="140" width="160" height="120" rx="8" fill="var(--color-accent)" opacity="0.3" />
      <defs>
        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'var(--color-accent)', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
}
