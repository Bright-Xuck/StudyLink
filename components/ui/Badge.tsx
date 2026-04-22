import { clsx } from "clsx";
import { type ReactNode } from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "error" | "info";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  icon?: ReactNode;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-gray-100)] text-[var(--color-text-secondary)]",
  primary: "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
  success: "bg-[var(--color-success-light)] text-emerald-700",
  warning: "bg-[var(--color-warning-light)] text-amber-700",
  error: "bg-[var(--color-error-light)] text-red-700",
  info: "bg-[var(--color-info-light)] text-blue-700",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-gray-400)]",
  primary: "bg-[var(--color-primary)]",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
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
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        "transition-colors duration-150",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span className={clsx("w-1.5 h-1.5 rounded-full", dotColors[variant])} />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

// Status Badge - for showing status with dot
interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "completed" | "error";
  label: string;
  className?: string;
}

const statusConfig: Record<StatusBadgeProps['status'], { variant: BadgeVariant; label: string }> = {
  active: { variant: "success", label: "Active" },
  inactive: { variant: "default", label: "Inactive" },
  pending: { variant: "warning", label: "Pending" },
  completed: { variant: "primary", label: "Completed" },
  error: { variant: "error", label: "Error" },
};

export function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} dot className={className}>
      {label}
    </Badge>
  );
}
