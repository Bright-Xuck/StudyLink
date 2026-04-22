"use client";

import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";

// Comprehensive list of Cameroonian secondary/high school subjects
const subjects = [
  {
    id: "math",
    name: "Mathematics",
    description: "Master algebra, geometry, trigonometry, and calculus aligned to GCE standards.",
    color: "bg-blue-50",
    icon: "∑",
    topics: ["Algebra", "Geometry", "Trigonometry", "Calculus", "Statistics"],
    students: 1200,
    level: ["Form 3", "Form 4", "Form 5"],
  },
  {
    id: "english",
    name: "English Language",
    description: "Develop language skills through literature, grammar, writing, and comprehension.",
    color: "bg-green-50",
    icon: "📚",
    topics: ["Literature", "Grammar", "Composition", "Comprehension", "Speaking"],
    students: 1550,
    level: ["Form 3", "Form 4", "Form 5"],
  },
  {
    id: "french",
    name: "French Language",
    description: "Learn French language and culture with conversation and writing practice.",
    color: "bg-purple-50",
    icon: "🇫🇷",
    topics: ["Grammaire", "Vocabulaire", "Lecture", "Écriture", "Conversation"],
    students: 890,
    level: ["Form 3", "Form 4", "Form 5"],
  },
  {
    id: "physics",
    name: "Physics",
    description: "Explore mechanics, thermodynamics, electricity, waves, and modern physics.",
    color: "bg-red-50",
    icon: "⚡",
    topics: ["Mechanics", "Thermodynamics", "Electricity", "Waves", "Modern Physics"],
    students: 750,
    level: ["Form 4", "Form 5"],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    description: "Understand atomic structure, reactions, organic chemistry, and lab techniques.",
    color: "bg-yellow-50",
    icon: "🧪",
    topics: ["Atomic Structure", "Bonding", "Reactions", "Organic Chemistry", "Lab Work"],
    students: 820,
    level: ["Form 4", "Form 5"],
  },
  {
    id: "biology",
    name: "Biology",
    description: "Study cells, genetics, ecology, and human biology with interactive models.",
    color: "bg-teal-50",
    icon: "🧬",
    topics: ["Cell Biology", "Genetics", "Ecology", "Human Body", "Evolution"],
    students: 950,
    level: ["Form 3", "Form 4", "Form 5"],
  },
  {
    id: "history",
    name: "History",
    description: "Explore world history, African history, and Cameroonian heritage and culture.",
    color: "bg-amber-50",
    icon: "🏛️",
    topics: ["World History", "African History", "Cameroon History", "Civilizations", "Modern Era"],
    students: 680,
    level: ["Form 3", "Form 4", "Form 5"],
  },
  {
    id: "geography",
    name: "Geography",
    description: "Study physical geography, human geography, and sustainable development.",
    color: "bg-cyan-50",
    icon: "🌍",
    topics: ["Physical Geography", "Human Geography", "Climate", "Resources", "Sustainability"],
    students: 620,
    level: ["Form 3", "Form 4", "Form 5"],
  },
  {
    id: "economics",
    name: "Economics",
    description: "Learn microeconomics, macroeconomics, and development economics principles.",
    color: "bg-orange-50",
    icon: "💰",
    topics: ["Supply & Demand", "Macroeconomics", "Trade", "Development", "Banking"],
    students: 540,
    level: ["Form 4", "Form 5"],
  },
  {
    id: "commerce",
    name: "Commerce",
    description: "Understand business principles, accounting, and commercial practices.",
    color: "bg-pink-50",
    icon: "🏢",
    topics: ["Business Basics", "Accounting", "Marketing", "Finance", "Trade"],
    students: 480,
    level: ["Form 3", "Form 4", "Form 5"],
  },
  {
    id: "literature",
    name: "Literature in English",
    description: "Analyze classic and contemporary literature with depth and critical thinking.",
    color: "bg-rose-50",
    icon: "📖",
    topics: ["Prose", "Poetry", "Drama", "Literary Analysis", "Writing"],
    students: 560,
    level: ["Form 4", "Form 5"],
  },
  {
    id: "ict",
    name: "ICT & Computer Science",
    description: "Learn programming basics, data structures, web development, and cybersecurity.",
    color: "bg-violet-50",
    icon: "💻",
    topics: ["Programming", "Web Dev", "Data Structures", "Cybersecurity", "Databases"],
    students: 720,
    level: ["Form 3", "Form 4", "Form 5"],
  },
];

export default function SubjectsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <section className="bg-[var(--color-primary)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Subjects</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Choose from a comprehensive range of subjects aligned with the Cameroonian curriculum. Each subject includes interactive lessons, practice problems, and expert guidance.
          </p>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Link key={subject.id} href={`/subjects/${subject.id}`}>
                <Card hover className="h-full cursor-pointer">
                  <div className="p-6">
                    {/* Icon */}
                    <div className="text-5xl mb-4">{subject.icon}</div>

                    {/* Name and description */}
                    <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-2">
                      {subject.name}
                    </h3>
                    <p className="text-[var(--color-foreground-muted)] mb-4 text-sm">
                      {subject.description}
                    </p>

                    {/* Topics */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-[var(--color-foreground)] mb-2">
                        Topics:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {subject.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="secondary" size="sm">
                            {topic}
                          </Badge>
                        ))}
                        {subject.topics.length > 3 && (
                          <Badge variant="secondary" size="sm">
                            +{subject.topics.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Levels and students */}
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-[var(--color-foreground-muted)]">
                          {subject.students} students
                        </p>
                        <p className="text-xs text-[var(--color-foreground-muted)]">
                          {subject.level.join(", ")}
                        </p>
                      </div>
                      <div className="text-[var(--color-accent)] font-semibold text-sm">
                        Start →
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--color-background-alt)] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-[var(--color-foreground-muted)] mb-8 text-lg">
            Take our personalized assessment to find the subjects that match your academic goals.
          </p>
          <Button variant="primary" size="lg">
            Take Assessment
          </Button>
        </div>
      </section>
    </div>
  );
}
