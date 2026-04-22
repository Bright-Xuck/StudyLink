const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Frontend Developer at TechCorp",
    content:
      "StudyLink transformed my career. The structured curriculum and hands-on projects gave me the confidence to land my dream job. The mentorship was invaluable.",
    avatar: "SC",
  },
  {
    id: 2,
    name: "Michael Okonkwo",
    role: "Data Analyst at DataFlow",
    content:
      "The Python for Data Science course was exactly what I needed. The practical approach and real-world datasets helped me transition from a traditional analyst role.",
    avatar: "MO",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Full-Stack Developer",
    content:
      "I tried many platforms before finding StudyLink. The difference is the quality of instruction and the supportive community. Worth every penny.",
    avatar: "ER",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-[var(--color-background-alt)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[var(--color-foreground)] text-balance">
            What Our Students Say
          </h2>
          <p className="mt-4 text-[var(--color-foreground-muted)] text-lg">
            Join thousands of successful learners who have transformed their
            careers with StudyLink.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 relative">
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 text-[var(--color-accent)] opacity-20">
        <QuoteIcon />
      </div>

      {/* Content */}
      <p className="text-[var(--color-foreground)] mb-6 leading-relaxed">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-semibold">
          {testimonial.avatar}
        </div>
        <div>
          <p className="font-semibold text-[var(--color-foreground)]">
            {testimonial.name}
          </p>
          <p className="text-sm text-[var(--color-foreground-muted)]">
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  );
}

function QuoteIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}
