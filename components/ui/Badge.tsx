type BadgeVariant = "default" | "accent" | "success" | "warning";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-background-alt)] text-[var(--color-foreground)]",
  accent: "bg-[var(--color-accent)] text-white",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
