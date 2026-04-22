import Link from "next/link";
import { Badge, Button } from "@/components/ui";

// Sample course data - this will later come from your backend API
const courses = [
  {
    id: "1",
    title: "Full-Stack Web Development",
    description:
      "Master React, Node.js, and PostgreSQL to build complete web applications from scratch. Learn modern development practices and deploy to production.",
    level: "Intermediate",
    duration: "12 weeks",
    students: 2500,
    rating: 4.8,
    price: 199,
    tags: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    instructor: "John Smith",
  },
  {
    id: "2",
    title: "Python for Data Science",
    description:
      "Learn Python, pandas, and machine learning fundamentals for data analysis and visualization. Build real data pipelines and ML models.",
    level: "Beginner",
    duration: "10 weeks",
    students: 3200,
    rating: 4.9,
    price: 149,
    tags: ["Python", "Pandas", "NumPy", "Scikit-learn"],
    instructor: "Dr. Lisa Chen",
  },
  {
    id: "3",
    title: "Mobile App Development",
    description:
      "Build cross-platform mobile apps with React Native and modern development practices. Ship to iOS and Android from a single codebase.",
    level: "Intermediate",
    duration: "8 weeks",
    students: 1800,
    rating: 4.7,
    price: 179,
    tags: ["React Native", "TypeScript", "Expo", "Mobile"],
    instructor: "Alex Johnson",
  },
  {
    id: "4",
    title: "DevOps & Cloud Computing",
    description:
      "Master Docker, Kubernetes, and AWS to deploy and scale applications. Learn CI/CD pipelines and infrastructure as code.",
    level: "Advanced",
    duration: "10 weeks",
    students: 1200,
    rating: 4.8,
    price: 249,
    tags: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    instructor: "Maria Garcia",
  },
  {
    id: "5",
    title: "JavaScript Fundamentals",
    description:
      "Build a solid foundation in JavaScript. Learn ES6+, async programming, and DOM manipulation for web development.",
    level: "Beginner",
    duration: "6 weeks",
    students: 4500,
    rating: 4.9,
    price: 99,
    tags: ["JavaScript", "ES6", "DOM", "Web"],
    instructor: "Tom Wilson",
  },
  {
    id: "6",
    title: "UI/UX Design Fundamentals",
    description:
      "Learn design principles, Figma, and user research methods. Create beautiful and functional user interfaces.",
    level: "Beginner",
    duration: "8 weeks",
    students: 2100,
    rating: 4.6,
    price: 129,
    tags: ["Figma", "UI Design", "UX Research", "Prototyping"],
    instructor: "Sarah Miller",
  },
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Explore Our Courses
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Choose from our comprehensive library of courses designed to take
            you from beginner to professional.
          </p>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-[var(--color-border)]">
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <button
                  key={level}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    level === "All Levels"
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-[var(--color-background-alt)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-accent)] hover:text-white"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Course Count */}
          <p className="text-[var(--color-foreground-muted)] mb-6">
            Showing {courses.length} courses
          </p>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
    </div>
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
  price: number;
  tags: string[];
  instructor: string;
}

function CourseCard({ course }: { course: Course }) {
  const levelColors: Record<string, "default" | "accent" | "success" | "warning"> = {
    Beginner: "success",
    Intermediate: "warning",
    Advanced: "accent",
  };

  return (
    <Link href={`/courses/${course.id}`} className="group">
      <div className="h-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[var(--color-accent)] hover:-translate-y-1 flex flex-col">
        {/* Course Image */}
        <div className="h-48 bg-[var(--color-primary)] flex items-center justify-center relative">
          <CourseIllustration />
          <Badge
            variant={levelColors[course.level] || "default"}
            className="absolute top-4 left-4"
          >
            {course.level}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {course.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-[var(--color-foreground-muted)] bg-[var(--color-background-alt)] px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
            {course.title}
          </h3>

          <p className="text-[var(--color-foreground-muted)] text-sm mb-4 line-clamp-2 flex-1">
            {course.description}
          </p>

          {/* Instructor */}
          <p className="text-sm text-[var(--color-foreground-muted)] mb-4">
            By <span className="text-[var(--color-foreground)]">{course.instructor}</span>
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-sm pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-3 text-[var(--color-foreground-muted)]">
              <span className="flex items-center gap-1">
                <ClockIcon />
                {course.duration}
              </span>
              <span className="flex items-center gap-1 text-amber-500">
                <StarIcon />
                {course.rating}
              </span>
            </div>
            <span className="font-bold text-[var(--color-accent)]">
              ${course.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CourseIllustration() {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="15"
        y="25"
        width="70"
        height="50"
        rx="6"
        fill="var(--color-accent)"
        fillOpacity="0.2"
      />
      <rect
        x="22"
        y="32"
        width="56"
        height="36"
        rx="3"
        stroke="var(--color-accent)"
        strokeWidth="2"
      />
      <path d="M42 45L55 53L42 61V45Z" fill="var(--color-accent)" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
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
