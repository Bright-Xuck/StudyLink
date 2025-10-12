import { notFound } from 'next/navigation';
import { getModuleBySlug } from '@/lib/actions/module.actions';
import { getAuthenticatedUser } from '@/lib/actions/auth.actions';
import { getTranslations } from 'next-intl/server';
import { Clock, BookOpen, Lock, CheckCircle } from 'lucide-react';
import EnrollButton from '@/components/modules/EnrollButton';
import ModuleContent from '@/components/modules/ModuleContent';
import Image from "next/image";

export default async function ModuleDetailPage({
  params: { slug },
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {   
  const cmodule = await getModuleBySlug(slug);
  const t = await getTranslations('module');

  if (!cmodule) {
    notFound();
  }

  const user = await getAuthenticatedUser();

  // Check if user has access to this module
  const hasAccess =
    cmodule.isFree ||
    (user && user.purchasedModules.includes(cmodule._id));

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary text-primary-foreground lg:py-46 py-20 md:py-32">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_1px)] bg-[length:24px_24px]"></div>

          <div className="px-8">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                {cmodule.isFree ? (
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {t('free')}
                  </span>
                ) : (
                  <span className="bg-primary-foreground/20 text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    {t('premium')}
                  </span>
                )}
                <span className="bg-primary-foreground/20 text-primary-foreground px-3 py-1 rounded-full text-sm capitalize">
                  {cmodule.level}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {cmodule.title}
              </h1>
              <p className="text-xl opacity-90 mb-6">
                {cmodule.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{cmodule.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>
                    {cmodule.objectives.length} {t('objectives')}
                  </span>
                </div>
                {hasAccess && (
                  <div className="flex items-center gap-2 text-accent">
                    <CheckCircle className="h-5 w-5" />
                    <span>{t('accessGranted')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-background"
            >
              <path
                d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </section>

        <div className="px-4 py-6 md:px-8 md:py-12">
          <div className="">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className={`${!searchParams?.lesson? "lg:col-span-2" : "lg:col-span-3"} space-y-8`}>
                {/* Learning Objectives */}
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {t('learningObjectives')}
                  </h2>
                  <ul className="space-y-3">
                    {cmodule.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">
                          {objective}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Module Content */}
                {hasAccess ? (
                  <ModuleContent lessons={cmodule.lessons || []} />
                ) : (
                  <div className="bg-card rounded-xl p-12 border border-border text-center">
                    <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {t('contentLocked')}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {t('contentLockedDescription')}
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              {!searchParams?.lesson && (
                <div className="lg:col-span-1">
                  <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
                    <div className="mb-6">
                      <Image
                        src={cmodule.imageUrl}
                        alt={cmodule.title}
                        width={48}
                        height={48}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />

                      {!cmodule.isFree && (
                        <div className="text-center mb-4">
                          <span className="text-3xl font-bold text-foreground">
                            {new Intl.NumberFormat('fr-CM', {
                              style: 'currency',
                              currency: 'XAF',
                            }).format(cmodule.price || 0)}
                          </span>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t('oneTimePayment')}
                          </p>
                        </div>
                      )}
                    </div>

                    <EnrollButton
                      moduleId={cmodule._id}
                      moduleTitle={cmodule.title}
                      isFree={cmodule.isFree}
                      price={cmodule.price || 0}
                      hasAccess={hasAccess as boolean}
                      isAuthenticated={!!user}
                    />

                    <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>{t('duration')}</span>
                        <span className="text-foreground font-medium">
                          {cmodule.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{t('level')}</span>
                        <span className="text-foreground font-medium capitalize">
                          {cmodule.level}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{t('access')}</span>
                        <span className="text-foreground font-medium">
                          {t('lifetime')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
