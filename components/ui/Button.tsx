import { Link } from "@/navigation";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-light)] active:bg-[var(--color-primary-dark)]",
  secondary:
    "bg-[var(--color-background-alt)] text-[var(--color-foreground)] hover:bg-[var(--color-border)] border border-[var(--color-border)]",
  outline:
    "border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-foreground)]",
  ghost:
    "text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-alt)]",
  accent:
    "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent-light)] active:bg-[var(--color-accent-dark)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  fullWidth = false,
  icon,
  iconPosition = "left",
}: ButtonProps) {
  const baseStyles = clsx(
    "inline-flex items-center justify-center font-medium",
    "rounded-[var(--radius-sm)] transition-all duration-200",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className
  );

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={baseStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
    >
      {content}
    </button>
  );
}
