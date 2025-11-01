'use client';

import { useTranslations } from 'next-intl';
import { Users, Zap, FileCheck, Award } from 'lucide-react';

export default function Features() {
  const t = useTranslations('features');

  const features = [
    {
      icon: Users,
      titleKey: 'experts.title',
      descKey: 'experts.description',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Zap,
      titleKey: 'actionable.title',
      descKey: 'actionable.description',
      color: 'bg-accent text-accent-foreground',
    },
    {
      icon: FileCheck,
      titleKey: 'quizzes.title',
      descKey: 'quizzes.description',
      color: 'bg-secondary text-secondary-foreground',
    },
    {
      icon: Award,
      titleKey: 'certificates.title',
      descKey: 'certificates.description',
      color: 'bg-muted text-muted-foreground',
    },
  ];

  return (
    <section className="py-20 bg-muted text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-border"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}