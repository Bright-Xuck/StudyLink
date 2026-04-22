import { clsx } from "clsx";

type BadgeVariant = "default" | "primary" | "accent" | "success" | "warning" | "error" | "info";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-background-alt)] text-[var(--color-foreground-muted)] border border-[var(--color-border)]",
  primary: "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]",
  accent: "bg-[var(--color-accent-light)] text-[var(--color-accent-dark)]",
  success: "bg-[var(--color-success-light)] text-green-700",
  warning: "bg-[var(--color-warning-light)] text-amber-700",
  error: "bg-[var(--color-error-light)] text-red-700",
  info: "bg-[var(--color-info-light)] text-blue-700",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  icon,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 font-medium rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
