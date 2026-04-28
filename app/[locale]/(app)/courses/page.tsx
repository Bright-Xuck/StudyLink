import { BookOpen } from 'lucide-react';
import { getTranslations } from "next-intl/server";
import Projects from '@/components/modules/projects.jsx'

export default async function CoursesPage() {
  const t = await getTranslations('CoursesPage');
  

  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative bg-primary text-primary-foreground  lg:py-46 py-20 md:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('header.title')}
            </h1>
            <p className="text-xl opacity-90">
              {t('header.description')}
            </p>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-background">
            <path
                d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="currentColor"
            />
            </svg>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Free Courses Section */}
       <Projects />

        {/* Premium Courses Section */}
       

        {/* Empty State */}
        
      </div>
    </div>
  );
}