"use client";

import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";

// Mock data for study groups
const allStudyGroups = [
  {
    id: 1,
    name: "GCE Preparation 2026",
    description: "Comprehensive preparation for GCE exams across all subjects",
    subject: "Mixed",
    members: 24,
    leader: "Amara N.",
    avatar: "AN",
    joinedStatus: true,
    activity: "5 posts today",
    lastPost: "30 mins ago",
    tags: ["Exam Prep", "Collaborative", "General"],
  },
  {
    id: 2,
    name: "Mathematics Form 5",
    description: "Focus on advanced mathematics topics for Form 5 students",
    subject: "Mathematics",
    members: 12,
    leader: "David J.",
    avatar: "DJ",
    joinedStatus: false,
    activity: "2 posts today",
    lastPost: "1 hour ago",
    tags: ["Math", "Form 5", "Problem Solving"],
  },
  {
    id: 3,
    name: "English Literature Readers",
    description: "Discuss and analyze classic and contemporary English literature",
    subject: "Literature",
    members: 8,
    leader: "Grace T.",
    avatar: "GT",
    joinedStatus: false,
    activity: "1 post today",
    lastPost: "2 hours ago",
    tags: ["Literature", "Discussion", "Analysis"],
  },
  {
    id: 4,
    name: "Physics Problem Solving",
    description: "Work through challenging physics problems together",
    subject: "Physics",
    members: 15,
    leader: "Samuel K.",
    avatar: "SK",
    joinedStatus: true,
    activity: "8 posts today",
    lastPost: "5 mins ago",
    tags: ["Physics", "Problems", "Concepts"],
  },
  {
    id: 5,
    name: "Chemistry Lab Techniques",
    description: "Share lab reports and discuss experimental techniques",
    subject: "Chemistry",
    members: 10,
    leader: "Blessing O.",
    avatar: "BO",
    joinedStatus: false,
    activity: "3 posts today",
    lastPost: "45 mins ago",
    tags: ["Chemistry", "Experiments", "Labs"],
  },
  {
    id: 6,
    name: "French Language Practice",
    description: "Practice French conversation and grammar with peers",
    subject: "French",
    members: 18,
    leader: "Marie D.",
    avatar: "MD",
    joinedStatus: false,
    activity: "12 posts today",
    lastPost: "10 mins ago",
    tags: ["French", "Conversation", "Grammar"],
  },
  {
    id: 7,
    name: "History & Culture Discussions",
    description: "Explore African and world history with critical thinking",
    subject: "History",
    members: 14,
    leader: "Kwame B.",
    avatar: "KB",
    joinedStatus: false,
    activity: "4 posts today",
    lastPost: "20 mins ago",
    tags: ["History", "Culture", "Discussion"],
  },
  {
    id: 8,
    name: "Economics Study Circle",
    description: "Learn economics concepts through case studies and debates",
    subject: "Economics",
    members: 9,
    leader: "Prudence M.",
    avatar: "PM",
    joinedStatus: true,
    activity: "6 posts today",
    lastPost: "15 mins ago",
    tags: ["Economics", "Cases", "Theory"],
  },
];

export default function StudyGroupsPage() {
  return (
    <div className="min-h-screen bg-(--color-background)">
      {/* Header Section */}
      <section className="bg-[(--color-primary)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Study Groups</h1>
              <p className="text-slate-300 max-w-2xl">
                Join study groups to collaborate with peers, share knowledge, and stay motivated. Learn together and achieve more!
              </p>
            </div>
            <Button variant="outline" size="lg" className="border-white text-white">
              + Create Group
            </Button>
          </div>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="bg-[var(--color-background-alt)] py-6 border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search study groups..."
              className="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-foreground)]"
            />
            <Button variant="outline" size="sm">
              Filter by Subject
            </Button>
            <Button variant="outline" size="sm">
              My Groups
            </Button>
          </div>
        </div>
      </section>

      {/* Study Groups Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allStudyGroups.map((group) => (
              <Card key={group.id} hover className="flex flex-col">
                <div className="p-6 flex-1">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Badge variant="secondary">{group.subject}</Badge>
                      <h3 className="text-lg font-bold text-[var(--color-foreground)] mt-2">
                        {group.name}
                      </h3>
                    </div>
                    {group.joinedStatus && (
                      <div className="text-2xl">✓</div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[var(--color-foreground-muted)] text-sm mb-4">
                    {group.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {group.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-[var(--color-background-alt)] text-[var(--color-foreground-muted)] px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Leader and Activity */}
                  <div className="border-t border-[var(--color-border)] pt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-xs font-bold">
                        {group.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[var(--color-foreground)]">
                          {group.leader}
                        </p>
                        <p className="text-xs text-[var(--color-foreground-muted)]">
                          Group Leader
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className="font-semibold text-[var(--color-foreground)]">
                          {group.members}
                        </p>
                        <p className="text-[var(--color-foreground-muted)]">Members</p>
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-foreground)]">
                          {group.activity.split(\" \")[0]}
                        </p>
                        <p className=\"text-[var(--color-foreground-muted)]\">Posts</p>
                      </div>
                      <div>
                        <p className=\"font-semibold text-[var(--color-foreground)]">
                          {group.lastPost}
                        </p>
                        <p className=\"text-[var(--color-foreground-muted)]\">Active</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <div className=\"border-t border-[var(--color-border)] p-6\">
                  {group.joinedStatus ? (
                    <Button variant=\"outline\" size=\"sm\" className=\"w-full\">
                      View Group
                    </Button>
                  ) : (
                    <Button variant=\"primary\" size=\"sm\" className=\"w-full\">
                      Join Group
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className=\"bg-[var(--color-background-alt)] py-16\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <h2 className=\"text-3xl font-bold text-[var(--color-foreground)] mb-12 text-center\">
            Why Join a Study Group?
          </h2>

          <div className=\"grid md:grid-cols-3 gap-8\">
            <div className=\"text-center\">
              <div className=\"text-5xl mb-4\">🤝</div>
              <h3 className=\"text-xl font-bold text-[var(--color-foreground)] mb-2\">
                Collaborate
              </h3>
              <p className=\"text-[var(--color-foreground-muted)]\">
                Work together with peers, share insights, and learn from different perspectives.
              </p>
            </div>

            <div className=\"text-center\">
              <div className=\"text-5xl mb-4\">🚀</div>
              <h3 className=\"text-xl font-bold text-[var(--color-foreground)] mb-2\">
                Stay Motivated
              </h3>
              <p className=\"text-[var(--color-foreground-muted)]\">
                Study groups provide accountability and encouragement to keep you on track.
              </p>
            </div>

            <div className=\"text-center\">
              <div className=\"text-5xl mb-4\">🏆</div>
              <h3 className=\"text-xl font-bold text-[var(--color-foreground)] mb-2\">
                Earn Rewards
              </h3>
              <p className=\"text-[var(--color-foreground-muted)]\">
                Participate actively and earn badges and recognition within your groups.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
