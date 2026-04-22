"use client";

import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";

// Mock data for student progress
const recentLessons = [
  {
    id: 1,
    subject: "Mathematics",
    title: "Quadratic Equations",
    progress: 75,
    lastAccessed: "2 hours ago",
    nextLesson: "Polynomial Functions",
  },
  {
    id: 2,
    subject: "English Language",
    title: "Shakespearian Drama",
    progress: 60,
    lastAccessed: "1 day ago",
    nextLesson: "Modern Poetry",
  },
  {
    id: 3,
    subject: "Physics",
    title: "Thermodynamics",
    progress: 85,
    lastAccessed: "30 mins ago",
    nextLesson: "Heat Transfer",
  },
];

const studyGoals = [
  {
    id: 1,
    title: "Complete Mathematics Form 5",
    progress: 65,
    deadline: "May 2026",
    lessons: "12/18 completed",
  },
  {
    id: 2,
    title: "Master Physics Concepts",
    progress: 55,
    deadline: "June 2026",
    lessons: "8/14 completed",
  },
];

const studyGroups = [
  {
    id: 1,
    name: "GCE Preparation 2026",
    subject: "Mixed",
    members: 24,
    leader: "Amara N.",
    activity: "5 posts today",
  },
  {
    id: 2,
    name: "Mathematics Form 5",
    subject: "Mathematics",
    members: 12,
    leader: "David J.",
    activity: "2 posts today",
  },
  {
    id: 3,
    name: "English Literature Readers",
    subject: "Literature",
    members: 8,
    leader: "Grace T.",
    activity: "1 post today",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/80 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, Student</h1>
              <p className="text-slate-300">
                You're on track! Keep up the great work on your studies.
              </p>
            </div>
            <Button variant="outline" size="lg" className="border-white text-white">
              Profile Settings
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-slate-300 text-sm">Total Study Hours</p>
              <p className="text-3xl font-bold mt-2">42</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-slate-300 text-sm">Lessons Completed</p>
              <p className="text-3xl font-bold mt-2">28</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-slate-300 text-sm">Current Streak</p>
              <p className="text-3xl font-bold mt-2">12 days</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-slate-300 text-sm">Average Score</p>
              <p className="text-3xl font-bold mt-2">82%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Continue Learning & Goals */}
            <div className="lg:col-span-2 space-y-8">
              {/* Continue Learning */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
                    Continue Learning
                  </h2>
                  <Link href="/subjects" className="text-[var(--color-accent)] hover:underline">
                    Browse all
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentLessons.map((lesson) => (
                    <Card key={lesson.id} hover>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <Badge variant="secondary">{lesson.subject}</Badge>
                            <h3 className="text-lg font-semibold text-[var(--color-foreground)] mt-2">
                              {lesson.title}
                            </h3>
                          </div>
                          <Button variant="primary" size="sm">
                            Continue
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--color-foreground-muted)]">
                              Progress
                            </span>
                            <span className="font-semibold text-[var(--color-foreground)]">
                              {lesson.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-[var(--color-border)] rounded-full h-2">
                            <div
                              className="bg-[var(--color-accent)] h-2 rounded-full"
                              style={{ width: `${lesson.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-[var(--color-foreground-muted)] mt-2">
                            Last accessed: {lesson.lastAccessed} • Next: {lesson.nextLesson}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Study Goals */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
                    Your Study Goals
                  </h2>
                  <Button variant="outline" size="sm">
                    + New Goal
                  </Button>
                </div>

                <div className="space-y-4">
                  {studyGoals.map((goal) => (
                    <Card key={goal.id}>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                            {goal.title}
                          </h3>
                          <span className="text-sm text-[var(--color-foreground-muted)]">
                            {goal.deadline}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--color-foreground-muted)]">
                              {goal.lessons}
                            </span>
                            <span className="font-semibold">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-[var(--color-border)] rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Study Groups */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
                  Study Groups
                </h2>
                <Button variant="outline" size="sm">
                  + Create
                </Button>
              </div>

              <div className="space-y-4">
                {studyGroups.map((group) => (
                  <Card key={group.id} hover className="cursor-pointer">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-[var(--color-foreground)] text-sm">
                          {group.name}
                        </h3>
                        <Badge variant="secondary" size="sm">
                          {group.subject}
                        </Badge>
                      </div>

                      <p className="text-xs text-[var(--color-foreground-muted)] mb-3">
                        Led by {group.leader}
                      </p>

                      <div className="space-y-2 text-xs">
                        <p className="text-[var(--color-foreground-muted)]">
                          👥 {group.members} members
                        </p>
                        <p className="text-[var(--color-foreground-muted)]">
                          💬 {group.activity}
                        </p>
                      </div>

                      <Button variant="outline" size="sm" className="w-full mt-4">
                        Join
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* AI Tutor Widget */}
              <Card className="mt-8 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent)]/80 text-white">
                <div className="p-6">
                  <p className="text-sm font-semibold mb-2">AI Tutor</p>
                  <h3 className="text-lg font-bold mb-3">Need Help?</h3>
                  <p className="text-sm mb-4 opacity-90">
                    Get personalized explanations and practice problems instantly.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full bg-white text-[var(--color-accent)]"
                  >
                    Chat with AI Tutor
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
