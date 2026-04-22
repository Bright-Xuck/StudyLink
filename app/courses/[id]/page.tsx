import Link from "next/link";
import { Button, Badge } from "@/components/ui";

// Sample course data - this will later come from your backend API
const coursesData: Record<string, Course> = {
  "1": {
    id: "1",
    title: "Full-Stack Web Development",
    description:
      "Master React, Node.js, and PostgreSQL to build complete web applications from scratch. This comprehensive course covers everything you need to become a professional full-stack developer.",
    level: "Intermediate",
    duration: "12 weeks",
    students: 2500,
    rating: 4.8,
    reviews: 342,
    price: 199,
    tags: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    instructor: {
      name: "John Smith",
      bio: "Senior Software Engineer with 10+ years of experience at top tech companies.",
      avatar: "JS",
    },
    curriculum: [
      {
        title: "Getting Started",
        lessons: ["Course Overview", "Setting Up Your Environment", "Introduction to Full-Stack Development"],
      },
      {
        title: "Frontend with React",
        lessons: ["React Fundamentals", "Components & Props", "State Management", "Hooks Deep Dive", "Building a Real App"],
      },
      {
        title: "Backend with Node.js",
        lessons: ["Node.js Basics", "Express Framework", "RESTful APIs", "Authentication", "Database Integration"],
      },
      {
        title: "Database & Deployment",
        lessons: ["PostgreSQL Fundamentals", "ORM with Prisma", "Cloud Deployment", "CI/CD Pipelines", "Final Project"],
      },
    ],
    features: [
      "12 weeks of structured content",
      "50+ hands-on coding exercises",
      "5 real-world projects",
      "Certificate of completion",
      "Lifetime access to materials",
      "Direct mentor support",
    ],
  },
  "2": {
    id: "2",
    title: "Python for Data Science",
    description:
      "Learn Python, pandas, and machine learning fundamentals for data analysis and visualization. Build real data pipelines and machine learning models from scratch.",
    level: "Beginner",
    duration: "10 weeks",
    students: 3200,
    rating: 4.9,
    reviews: 485,
    price: 149,
    tags: ["Python", "Pandas", "NumPy", "Scikit-learn"],
    instructor: {
      name: "Dr. Lisa Chen",
      bio: "Data Scientist and AI researcher with a PhD from MIT.",
      avatar: "LC",
    },
    curriculum: [
      {
        title: "Python Foundations",
        lessons: ["Python Basics", "Data Structures", "Functions & Modules", "Object-Oriented Python"],
      },
      {
        title: "Data Analysis",
        lessons: ["NumPy Arrays", "Pandas DataFrames", "Data Cleaning", "Exploratory Analysis"],
      },
      {
        title: "Visualization",
        lessons: ["Matplotlib Basics", "Seaborn for Statistics", "Interactive Plots", "Dashboard Creation"],
      },
      {
        title: "Machine Learning",
        lessons: ["ML Fundamentals", "Supervised Learning", "Model Evaluation", "Final Project"],
      },
    ],
    features: [
      "10 weeks of content",
      "40+ coding exercises",
      "Real datasets from industry",
      "Certificate of completion",
      "Lifetime access",
      "Community support",
    ],
  },
};

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  students: number;
  rating: number;
  reviews: number;
  price: number;
  tags: string[];
  instructor: {
    name: string;
    bio: string;
    avatar: string;
  };
  curriculum: {
    title: string;
    lessons: string[];
  }[];
  features: string[];
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = coursesData[id];

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Button href="/courses">Back to Courses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeftIcon />
                Back to Courses
              </Link>

              <div className="flex flex-wrap gap-2 mb-4">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="accent">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
                {course.title}
              </h1>

              <p className="text-lg text-slate-300 mb-6 max-w-2xl">
                {course.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <StarIcon />
                  {course.rating} ({course.reviews} reviews)
                </span>
                <span className="flex items-center gap-2">
                  <UsersIcon />
                  {course.students.toLocaleString()} students
                </span>
                <span className="flex items-center gap-2">
                  <ClockIcon />
                  {course.duration}
                </span>
                <Badge variant="default">{course.level}</Badge>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--color-card)] rounded-xl p-6 text-[var(--color-foreground)] shadow-xl">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">${course.price}</span>
                  <span className="text-[var(--color-foreground-muted)]">
                    {" "}
                    one-time
                  </span>
                </div>

                <Button variant="primary" size="lg" className="w-full mb-4">
                  Enroll Now
                </Button>

                <Button variant="outline" size="lg" className="w-full">
                  Try Free Preview
                </Button>

                <ul className="mt-6 space-y-3">
                  {course.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-[var(--color-foreground-muted)]"
                    >
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Curriculum */}
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-6">
                  Curriculum
                </h2>
                <div className="space-y-4">
                  {course.curriculum.map((module, index) => (
                    <CurriculumModule
                      key={index}
                      moduleNumber={index + 1}
                      title={module.title}
                      lessons={module.lessons}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Instructor */}
              <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">
                  Your Instructor
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-xl font-bold">
                    {course.instructor.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-foreground)]">
                      {course.instructor.name}
                    </p>
                    <p className="text-sm text-[var(--color-foreground-muted)]">
                      Course Instructor
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  {course.instructor.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CurriculumModule({
  moduleNumber,
  title,
  lessons,
}: {
  moduleNumber: number;
  title: string;
  lessons: string[];
}) {
  return (
    <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
      <div className="bg-[var(--color-background-alt)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-white text-sm font-bold flex items-center justify-center">
            {moduleNumber}
          </span>
          <h3 className="font-semibold text-[var(--color-foreground)]">
            {title}
          </h3>
        </div>
        <span className="text-sm text-[var(--color-foreground-muted)]">
          {lessons.length} lessons
        </span>
      </div>
      <ul className="divide-y divide-[var(--color-border)]">
        {lessons.map((lesson, index) => (
          <li
            key={index}
            className="px-6 py-3 flex items-center gap-3 text-[var(--color-foreground-muted)]"
          >
            <PlayIcon />
            <span>{lesson}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-amber-500"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="16"
      height="16"
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

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-accent)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M10 8l6 4-6 4V8z" />
    </svg>
  );
}
