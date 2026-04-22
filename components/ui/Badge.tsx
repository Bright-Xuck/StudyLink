type BadgeVariant = "default" | "accent" | "success" | "warning" | "secondary";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-background-alt)] text-[var(--color-foreground)]",
  accent: "bg-[var(--color-accent)] text-white",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  secondary: "bg-[var(--color-background-alt)] text-[var(--color-foreground)]",
};

const sizeStyles = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1 text-xs",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
