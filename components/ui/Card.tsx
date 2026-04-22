interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "default" | "gradient" | "glass";
  animated?: boolean;
}

export function Card({
  children,
  className = "",
  hover = false,
  variant = "default",
  animated = false,
}: CardProps) {
  const variantStyles = {
    default:
      "bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm",
    gradient:
      "bg-gradient-to-br from-white to-[var(--color-background-alt)] border border-[var(--color-border)] shadow-md",
    glass: "glass shadow-lg",
  };

  const hoverStyles = hover
    ? "hover:shadow-2xl hover:border-[var(--color-accent)]/30 hover:-translate-y-1"
    : "";

  const animatedClass = animated ? "animate-fade-in-up" : "";

  return (
    <div
      className={`${variantStyles[variant]} rounded-2xl p-6 transition-smooth ${hoverStyles} ${animatedClass} ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function CardHeader({
  children,
  className = "",
  icon,
}: CardHeaderProps) {
  return (
    <div className={`mb-4 flex items-center gap-3 ${className}`}>
      {icon && <div className="text-2xl">{icon}</div>}
      <div>{children}</div>
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3
      className={`text-xl font-bold text-[var(--color-foreground)] ${className}`}
    >
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({
  children,
  className = "",
}: CardDescriptionProps) {
  return (
    <p className={`text-[var(--color-foreground-muted)] mt-2 text-sm ${className}`}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`mt-6 pt-4 border-t border-[var(--color-border)] ${className}`}>
      {children}
    </div>
  );
}
