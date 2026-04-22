import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "gradient";
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
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] shadow-lg hover:shadow-xl active:scale-95",
  secondary:
    "bg-[var(--color-primary-light)] text-white hover:bg-[var(--color-primary)] shadow-lg hover:shadow-xl active:scale-95",
  outline:
    "border-2 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 active:scale-95",
  ghost:
    "text-[var(--color-foreground)] hover:bg-[var(--color-background-alt)] active:scale-95",
  gradient:
    "bg-gradient-accent-to-secondary text-white shadow-lg hover:shadow-xl active:scale-95",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm font-medium",
  md: "px-6 py-3 text-base font-medium",
  lg: "px-8 py-4 text-lg font-semibold",
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
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] transition-smooth focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:transition-none";
  
  const widthStyles = fullWidth ? "w-full" : "";
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        {icon && <span className="flex items-center">{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedStyles}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
}
