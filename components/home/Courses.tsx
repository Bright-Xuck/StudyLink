'use client';

import { useTranslations } from 'next-intl';
import ModuleCard from '@/components/modules/ModuleCard';

interface Module {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  isFree: boolean;
  price?: number;
  slug: string;
}

interface CoursesProps {
  modules: Module[];
}

export default function Courses({ modules }: CoursesProps) {
  const t = useTranslations('courses');

  // Show only first 6 modules on homepage
  const featuredModules = modules.slice(0, 6);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredModules.map((module) => (
            <ModuleCard
              key={module._id}
              id={module._id}
              title={module.title}
              description={module.description}
              imageUrl={module.imageUrl}
              isFree={module.isFree}
              price={module.price}
              slug={module.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}