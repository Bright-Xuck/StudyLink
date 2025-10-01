import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Courses from '@/components/home/Courses';
import { getAllModules } from '@/lib/actions/module.actions';
import { Link } from "../../i18n/navigation";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {

  const modules = await getAllModules();

  return (
    <div className="min-h-screen flex flex-col">

      <Header />
      
      <main className="flex-1">
        <Hero />
        <Features />
        <Courses modules={modules} />
        
        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {locale === 'en' 
                ? 'Ready to Start Your Research Journey?' 
                : 'Prêt à commencer votre parcours de recherche?'}
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {locale === 'en'
                ? 'Join thousands of researchers who have enhanced their skills with our comprehensive training platform.'
                : 'Rejoignez des milliers de chercheurs qui ont amélioré leurs compétences avec notre plateforme de formation complète.'}
            </p>
            <Link
              href={`/register`}
              className="inline-block bg-background text-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              {locale === 'en' ? 'Get Started for Free' : 'Commencer gratuitement'}
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}