'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import ContactCards from "@/components/contactUs/contactcards.jsx"
import Form from "@/components/contactUs/form.jsx"
import FAQ from "@/components/contactUs/FAQ.jsx"

export default function ContactUs () {
  const t = useTranslations("contactUs")
  return (
    <div className="bg-neutral-100">
      <section className="py-12 md:py-16 lg:py-20 relative mb-5">
        <article className="text-primary-foreground">
          <div className="bg-primary py-16 md:py-24 lg:py-32 flex flex-col justify-center items-center px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight text-center max-w-5xl">
              {t("title")}
            </h1>
            <h1 className="text-base md:text-lg lg:text-xl text-center max-w-3xl opacity-90">
              {t("header")}
            </h1>
          </div>
        </article>
        <ContactCards/>
        <Form/>
        <FAQ/>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-background w-full h-auto"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>
    </div>
  )
}