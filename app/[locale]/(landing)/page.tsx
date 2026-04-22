'use client';

import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { CoursesPreview } from '@/components/sections/CoursesPreview';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTA } from '@/components/sections/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <CoursesPreview />
      <Testimonials />
      <CTA />
    </>
  );
}
