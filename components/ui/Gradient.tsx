interface GradientBackgroundProps {
  className?: string;
  variant?: "primary" | "accent" | "secondary";
  animated?: boolean;
}

export function GradientBackground({
  className = "",
  variant = "primary",
  animated = false,
}: GradientBackgroundProps) {
  const variants = {
    primary: "from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-accent)]/20",
    accent: "from-[var(--color-accent)] via-[var(--color-accent-light)] to-[var(--color-secondary)]",
    secondary: "from-[var(--color-secondary)] via-[var(--color-accent)] to-[var(--color-primary)]/40",
  };

  const animationClass = animated ? "animate-gradient-shift" : "";

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${variants[variant]} ${animationClass} ${className}`}
      style={animated ? { backgroundSize: "200% 200%" } : {}}
    />
  );
}

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "accent" | "secondary";
}

export function GradientText({
  children,
  className = "",
  variant = "accent",
}: GradientTextProps) {
  const variants = {
    primary: "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-transparent bg-clip-text",
    accent: "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] text-transparent bg-clip-text",
    secondary: "bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] text-transparent bg-clip-text",
  };

  return <span className={`${variants[variant]} ${className}`}>{children}</span>;
}
