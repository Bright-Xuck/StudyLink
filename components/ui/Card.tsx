import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={clsx(
        "bg-[var(--color-card)] border border-[var(--color-card-border)]",
        "rounded-[var(--radius-lg)] transition-all duration-200",
        paddingStyles[padding],
        hover && "hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-md)]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={clsx("mb-4", className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
}

export function CardTitle({
  children,
  className = "",
  as: Component = "h3",
}: CardTitleProps) {
  return (
    <Component
      className={clsx(
        "font-semibold text-[var(--color-foreground)] text-balance",
        Component === "h2" && "text-xl",
        Component === "h3" && "text-lg",
        Component === "h4" && "text-base",
        className
      )}
    >
      {children}
    </Component>
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
    <p className={clsx("text-sm text-[var(--color-foreground-muted)] mt-1.5", className)}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={clsx(className)}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div
      className={clsx(
        "mt-6 pt-4 border-t border-[var(--color-border)] flex items-center gap-3",
        className
      )}
    >
      {children}
    </div>
  );
}
