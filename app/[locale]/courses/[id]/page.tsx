'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = {
    id: params.id,
    title: 'React Fundamentals',
    description: 'Learn the basics of React and build interactive UIs',
    instructor: 'Sarah Johnson',
    level: 'Beginner',
    lessons: 24,
    students: 3200,
    image: '',
    rating: 4.8,
    reviews: 1250,
    duration: '6 weeks',
    price: 49.99,
    enrolled: false,
    chapters: [
      { id: 1, title: 'Getting Started', lessons: 4 },
      { id: 2, title: 'Components & Props', lessons: 5 },
      { id: 3, title: 'State Management', lessons: 6 },
      { id: 4, title: 'Hooks Deep Dive', lessons: 5 },
      { id: 5, title: 'Building Projects', lessons: 4 },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Badge variant="accent" className="mb-4">
              {course.level}
            </Badge>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-slate-300 mb-4">By {course.instructor}</p>
            <div className="flex gap-6 mb-8">
              <div>
                <p className="text-sm text-slate-400">Rating</p>
                <p className="text-2xl font-bold">{course.rating} ⭐</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Reviews</p>
                <p className="text-2xl font-bold">{course.reviews}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Duration</p>
                <p className="text-2xl font-bold">{course.duration}</p>
              </div>
            </div>
            <Button variant="primary" size="lg">
              Enroll Now - ${course.price}
            </Button>
          </div>
        </div>

        {/* Course Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Course Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--color-foreground-muted)] mb-4">
                    {course.description}
                  </p>
                  <p className="text-[var(--color-foreground-muted)]">
                    Master React fundamentals through interactive lessons, real-world examples, and hands-on projects. Build modern, responsive web applications with confidence.
                  </p>
                </CardContent>
              </Card>

              {/* Course Curriculum */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {course.chapters.map((chapter) => (
                      <div key={chapter.id} className="border-l-4 border-[var(--color-accent)] pl-4 py-2">
                        <p className="font-semibold text-[var(--color-foreground)]">{chapter.title}</p>
                        <p className="text-sm text-[var(--color-foreground-muted)]">{chapter.lessons} lessons</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold mb-4">${course.price}</p>
                  <Button variant="primary" size="lg" className="w-full mb-4">
                    Enroll Now
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    Add to Wishlist
                  </Button>

                  <div className="mt-6 space-y-3 border-t border-[var(--color-border)] pt-6">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-foreground)]">Lessons</p>
                      <p className="text-lg text-[var(--color-accent)]">{course.lessons}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-foreground)]">Students</p>
                      <p className="text-lg text-[var(--color-accent)]">{course.students}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-foreground)]">Level</p>
                      <p className="text-lg text-[var(--color-accent)]">{course.level}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
