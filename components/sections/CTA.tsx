import { Button } from "@/components/ui";

export function CTA() {
  return (
    <section className="py-20 bg-[var(--color-primary)] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <CirclePattern />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
          Ready to Start Your{" "}
          <span className="text-[var(--color-accent)]">Tech Journey</span>?
        </h2>
        <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
          Join thousands of learners who have transformed their careers. Start
          with a free course today and unlock your potential.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" href="/auth/register">
            Get Started Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            href="/courses"
            className="border-white text-white hover:bg-white hover:text-[var(--color-primary)]"
          >
            Browse Courses
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-slate-400 text-sm">
          <span className="flex items-center gap-2">
            <CheckIcon />
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <CheckIcon />
            Free starter courses
          </span>
          <span className="flex items-center gap-2">
            <CheckIcon />
            Cancel anytime
          </span>
        </div>
      </div>
    </section>
  );
}

function CirclePattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="circles"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="30" cy="30" r="20" fill="none" stroke="white" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circles)" />
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
