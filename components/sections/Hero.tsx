import { Button } from "@/components/ui";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-primary)] text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <GridPattern />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <span className="inline-block px-4 py-2 bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded-full text-sm font-medium">
              Start Learning Today
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Master{" "}
              <span className="text-[var(--color-accent)]">Mainstream Tech</span>{" "}
              Skills
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
              Learn the most in-demand programming languages, frameworks, and
              tools through structured courses designed by industry experts.
              Build real projects and launch your tech career.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="lg" href="/courses">
                Explore Courses
              </Button>
              <Button variant="outline" size="lg" href="/about">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-slate-700">
              <Stat value="10K+" label="Students" />
              <Stat value="50+" label="Courses" />
              <Stat value="95%" label="Satisfaction" />
            </div>
          </div>

          {/* Illustration */}
          <div className="hidden md:block">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-[var(--color-accent)]">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

function GridPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md mx-auto"
    >
      {/* Monitor */}
      <rect
        x="60"
        y="60"
        width="280"
        height="200"
        rx="12"
        fill="var(--color-primary-light)"
        stroke="var(--color-accent)"
        strokeWidth="2"
      />
      <rect x="80" y="80" width="240" height="160" rx="4" fill="#1e293b" />

      {/* Code Lines */}
      <rect x="100" y="100" width="120" height="8" rx="4" fill="var(--color-accent)" opacity="0.8" />
      <rect x="100" y="120" width="80" height="8" rx="4" fill="#94a3b8" opacity="0.6" />
      <rect x="100" y="140" width="160" height="8" rx="4" fill="#94a3b8" opacity="0.6" />
      <rect x="100" y="160" width="100" height="8" rx="4" fill="var(--color-accent)" opacity="0.6" />
      <rect x="100" y="180" width="140" height="8" rx="4" fill="#94a3b8" opacity="0.6" />
      <rect x="100" y="200" width="60" height="8" rx="4" fill="var(--color-accent)" opacity="0.8" />

      {/* Monitor Stand */}
      <rect x="170" y="260" width="60" height="20" fill="var(--color-primary-light)" />
      <rect x="140" y="280" width="120" height="10" rx="5" fill="var(--color-primary-light)" />

      {/* Floating Elements */}
      <circle cx="340" cy="100" r="20" fill="var(--color-accent)" opacity="0.3" />
      <circle cx="60" cy="320" r="30" fill="var(--color-accent)" opacity="0.2" />
      <rect x="320" y="200" width="40" height="40" rx="8" fill="var(--color-accent)" opacity="0.2" />
    </svg>
  );
}
