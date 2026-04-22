interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Container({ children, className = "", size = "lg" }: ContainerProps) {
  const sizes = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-7xl",
    xl: "max-w-full",
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "primary" | "secondary";
  animated?: boolean;
}

export function Section({
  children,
  className = "",
  variant = "default",
  animated = false,
}: SectionProps) {
  const variants = {
    default: "bg-[var(--color-background)]",
    primary: "bg-gradient-primary text-white",
    secondary: "bg-[var(--color-background-alt)]",
  };

  const animatedClass = animated ? "animate-fade-in-up" : "";

  return (
    <section className={`py-16 md:py-24 ${variants[variant]} ${animatedClass} ${className}`}>
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  description,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center" : "";

  return (
    <div className={`mb-12 md:mb-16 ${alignClass} ${className}`}>
      {subtitle && (
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-3">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-foreground)] mb-4">
        {title}
      </h2>
      {description && (
        <p className={`text-lg text-[var(--color-foreground-muted)] max-w-2xl ${
          align === "center" ? "mx-auto" : ""
        }`}>
          {description}
        </p>
      )}
    </div>
  );
}

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: "1" | "2" | "3" | "4" | "6";
  gap?: "sm" | "md" | "lg";
}

export function Grid({ children, className = "", cols = "3", gap = "md" }: GridProps) {
  const colsClass = {
    "1": "grid-cols-1",
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-2 lg:grid-cols-3",
    "4": "md:grid-cols-2 lg:grid-cols-4",
    "6": "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };

  const gapClass = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <div className={`grid ${colsClass[cols]} ${gapClass[gap]} ${className}`}>
      {children}
    </div>
  );
}
