'use client';

import { useTranslations } from 'next-intl';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  course: string;
}

export default function Testimonials() {
  const t = useTranslations('testimonials');

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Software Developer',
      avatar: '/avatars/sarah.jpg',
      content: 'testimonials.testimonial1.content',
      rating: 5,
      course: 'Advanced Web Development'
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Data Analyst',
      avatar: '/avatars/michael.jpg',
      content: 'testimonials.testimonial2.content',
      rating: 5,
      course: 'Data Science Fundamentals'
    },
    {
      id: '3',
      name: 'Amina Diallo',
      role: 'Business Owner',
      avatar: '/avatars/amina.jpg',
      content: 'testimonials.testimonial3.content',
      rating: 5,
      course: 'Digital Marketing Strategy'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-border relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-primary/20">
                <Quote className="w-8 h-8" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Content */}
              <p className="text-card-foreground mb-6 leading-relaxed italic">
                &quot;{t(testimonial.content)}&quot;
              </p>

              {/* Course */}
              <div className="mb-4">
                <span className="text-sm text-primary font-semibold">
                  {testimonial.course}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-border">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <div className="text-muted-foreground">{t('stats.students')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <div className="text-muted-foreground">{t('stats.satisfaction')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">{t('stats.courses')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">15+</div>
            <div className="text-muted-foreground">{t('stats.instructors')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}