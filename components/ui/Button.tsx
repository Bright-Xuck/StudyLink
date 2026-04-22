'use client';

import { Link } from "@/navigation";
import { clsx } from "clsx";
import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: clsx(
    "bg-[var(--color-primary)] text-white",
    "hover:bg-[var(--color-primary-hover)]",
    "active:scale-[0.98]",
    "shadow-sm hover:shadow"
  ),
  secondary: clsx(
    "bg-white text-[var(--color-text-primary)]",
    "border border-[var(--color-border)]",
    "hover:bg-[var(--color-gray-50)] hover:border-[var(--color-border-hover)]",
    "active:scale-[0.98]"
  ),
  ghost: clsx(
    "bg-transparent text-[var(--color-text-secondary)]",
    "hover:bg-[var(--color-gray-100)] hover:text-[var(--color-text-primary)]",
    "active:bg-[var(--color-gray-200)]"
  ),
  danger: clsx(
    "bg-[var(--color-error)] text-white",
    "hover:bg-red-600",
    "active:scale-[0.98]",
    "shadow-sm"
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-9 px-4 text-sm gap-2 rounded-lg",
  lg: "h-11 px-5 text-sm gap-2.5 rounded-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      href,
      fullWidth = false,
      leftIcon,
      rightIcon,
      isLoading = false,
      disabled,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const classes = clsx(
      "inline-flex items-center justify-center",
      "font-medium whitespace-nowrap select-none",
      "transition-all duration-150 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && "w-full",
      className
    );

    const content = (
      <>
        {isLoading && <LoadingSpinner />}
        {!isLoading && leftIcon && <span className="flex-shrink-0 -ml-0.5">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0 -mr-0.5">{rightIcon}</span>}
      </>
    );

    if (href && !isDisabled) {
      return (
        <Link href={href} className={classes}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={classes}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 mr-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export { Button, type ButtonProps };
