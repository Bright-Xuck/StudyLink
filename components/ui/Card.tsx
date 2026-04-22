import { clsx } from "clsx";
import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  border?: boolean;
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
  border = true,
}: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-xl",
        "transition-all duration-200 ease-out",
        paddingStyles[padding],
        border && "border border-[var(--color-border)]",
        hover && [
          "hover:border-[var(--color-border-hover)]",
          "hover:shadow-[var(--shadow-md)]",
          "cursor-pointer"
        ],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function CardHeader({ children, className = "", action }: CardHeaderProps) {
  return (
    <div className={clsx("flex items-start justify-between gap-4 mb-4", className)}>
      <div className="flex-1 min-w-0">{children}</div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
}

export function CardTitle({
  children,
  className = "",
  as: Component = "h3",
}: CardTitleProps) {
  const sizeStyles = {
    h2: "text-lg font-semibold tracking-tight",
    h3: "text-base font-semibold tracking-tight",
    h4: "text-sm font-semibold",
  };

  return (
    <Component
      className={clsx(
        "text-[var(--color-text-primary)] text-balance leading-tight",
        sizeStyles[Component],
        className
      )}
    >
      {children}
    </Component>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return (
    <p className={clsx(
      "text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed",
      className
    )}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={clsx(className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
  border?: boolean;
}

export function CardFooter({ children, className = "", border = true }: CardFooterProps) {
  return (
    <div
      className={clsx(
        "mt-5 pt-4 flex items-center gap-3",
        border && "border-t border-[var(--color-border)]",
        className
      )}
    >
      {children}
    </div>
  );
}

// Stat Card - for dashboard metrics
interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, change, icon, className = "" }: StatCardProps) {
  return (
    <Card className={clsx("relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            {label}
          </p>
          <p className="text-2xl font-semibold text-[var(--color-text-primary)] tracking-tight">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1.5">
              <span
                className={clsx(
                  "text-xs font-medium",
                  change.trend === "up" && "text-[var(--color-success)]",
                  change.trend === "down" && "text-[var(--color-error)]",
                  change.trend === "neutral" && "text-[var(--color-text-tertiary)]"
                )}
              >
                {change.trend === "up" && "↑"}
                {change.trend === "down" && "↓"}
                {change.value}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-lg bg-[var(--color-gray-100)] text-[var(--color-text-secondary)]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
