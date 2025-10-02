'use client';

import React from "react";
import { useTranslations } from "next-intl";
import TeamMembers from "@/components/about/TeamMembers.jsx";
import Instructors from "@/components/about/Instructors.jsx"
import Informational from "@/components/about/Informational.jsx"
import Reviews from "@/components/about/Reviews.jsx"

export default function AboutUs() {
  const t = useTranslations("about");

  return (
    <div>
        <article className="relative bg-primary text-primary-foreground lg:py-46 py-20 md:py-32">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-col justify-center items-center px-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight text-center max-w-5xl">
                  {t("title")}
                </h1>
                <h1 className="text-base md:text-lg lg:text-xl text-center max-w-3xl opacity-90">
                  {t("header")}
                </h1>
              </div>
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
        </article>
      <section className="py-12 md:py-16 lg:py-20">
        <TeamMembers />
        <div className="w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] max-w-6xl mx-auto mt-8 md:mt-12 flex flex-col gap-3 md:gap-4 items-center bg-card rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 shadow-sm hover:shadow-xl transition-all duration-300 border border-border">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center">{t("story")}</h1>
          <p className="font-light text-sm md:text-base lg:text-lg leading-relaxed text-center text-muted-foreground max-w-4xl">
            {t("storydescription")}
          </p>
        </div>
      </section>
      <section className="border-t border-border shadow-[0_-6px_10px_-4px]">
        <div className="bg-card rounded-xl md:rounded-2xl p-6 md:p-10 lg:p-12 shadow-sm hover:shadow-xl transition-all duration-300 border border-border max-w-6xl mx-auto my-8 md:my-12 lg:my-16 w-[95%] md:w-[90%]">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-card-foreground mb-3 md:mb-4 text-center">
            {t("meet")}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-center text-sm md:text-base lg:text-lg max-w-3xl mx-auto">
            {t("meetdescription")}
          </p>
        </div>
        <Instructors/>
        <Informational/>
        <Reviews/>
      </section>
    </div>
  );
}