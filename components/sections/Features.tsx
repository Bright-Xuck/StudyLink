import { Card, CardContent } from "@/components/ui";

const features = [
  {
    title: "Structured Learning Paths",
    description:
      "Follow carefully curated learning paths designed to take you from beginner to job-ready in your chosen tech stack.",
    icon: "path",
  },
  {
    title: "Hands-on Projects",
    description:
      "Build real-world projects that you can add to your portfolio. Learn by doing, not just watching videos.",
    icon: "code",
  },
  {
    title: "Expert Mentorship",
    description:
      "Get guidance from industry professionals who have worked at top tech companies.",
    icon: "mentor",
  },
  {
    title: "Community Support",
    description:
      "Join a vibrant community of learners. Collaborate, share knowledge, and grow together.",
    icon: "community",
  },
  {
    title: "Industry Certificates",
    description:
      "Earn recognized certificates upon course completion to showcase your skills to employers.",
    icon: "certificate",
  },
  {
    title: "Flexible Learning",
    description:
      "Learn at your own pace with lifetime access to course materials. Study anytime, anywhere.",
    icon: "clock",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-[var(--color-background-alt)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[var(--color-foreground)] text-balance">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-[var(--color-foreground-muted)] text-lg">
            We provide all the tools and resources you need to master tech skills
            and advance your career.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} hover>
              <CardContent>
                <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center mb-4">
                  <FeatureIcon type={feature.icon} />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--color-foreground-muted)]">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureIcon({ type }: { type: string }) {
  const iconPaths: Record<string, string> = {
    path: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    code: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    mentor: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    community: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    certificate: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
    clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  };

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-accent)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={iconPaths[type]} />
    </svg>
  );
}
