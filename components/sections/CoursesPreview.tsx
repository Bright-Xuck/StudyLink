import Link from "next/link";
import { Button, Badge } from "@/components/ui";

// Sample course data - this will later come from an API
const featuredCourses = [
  {
    id: "1",
    title: "Full-Stack Web Development",
    description:
      "Master React, Node.js, and PostgreSQL to build complete web applications from scratch.",
    level: "Intermediate",
    duration: "12 weeks",
    students: 2500,
    rating: 4.8,
    image: "/images/course-web.svg",
    tags: ["React", "Node.js", "PostgreSQL"],
  },
  {
    id: "2",
    title: "Python for Data Science",
    description:
      "Learn Python, pandas, and machine learning fundamentals for data analysis and visualization.",
    level: "Beginner",
    duration: "10 weeks",
    students: 3200,
    rating: 4.9,
    image: "/images/course-python.svg",
    tags: ["Python", "Pandas", "ML"],
  },
  {
    id: "3",
    title: "Mobile App Development",
    description:
      "Build cross-platform mobile apps with React Native and modern development practices.",
    level: "Intermediate",
    duration: "8 weeks",
    students: 1800,
    rating: 4.7,
    image: "/images/course-mobile.svg",
    tags: ["React Native", "TypeScript", "Expo"],
  },
];

export function CoursesPreview() {
  return (
    <section className="py-20 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <span className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-wider">
              Popular Courses
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">
              Start Your Learning Journey
            </h2>
          </div>
          <Button variant="outline" href="/courses">
            View All Courses
          </Button>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  students: number;
  rating: number;
  image: string;
  tags: string[];
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`} className="group">
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[var(--color-accent)] hover:-translate-y-1">
        {/* Course Image */}
        <div className="h-48 bg-[var(--color-primary)] flex items-center justify-center">
          <CourseIllustration type={course.id} />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {course.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
            {course.title}
          </h3>

          <p className="text-[var(--color-foreground-muted)] text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-[var(--color-foreground-muted)]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <ClockIcon />
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <UsersIcon />
                {course.students.toLocaleString()}
              </span>
            </div>
            <span className="flex items-center gap-1 text-amber-500">
              <StarIcon />
              {course.rating}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CourseIllustration({ type }: { type: string }) {
  const colors = {
    "1": "var(--color-accent)",
    "2": "#10b981",
    "3": "#8b5cf6",
  };
  const color = colors[type as keyof typeof colors] || "var(--color-accent)";

  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="20"
        y="30"
        width="80"
        height="60"
        rx="8"
        fill={color}
        fillOpacity="0.2"
      />
      <rect
        x="30"
        y="40"
        width="60"
        height="40"
        rx="4"
        stroke={color}
        strokeWidth="2"
      />
      <path d="M50 55L65 65L50 75V55Z" fill={color} />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
