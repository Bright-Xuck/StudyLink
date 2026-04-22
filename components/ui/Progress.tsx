import { clsx } from "clsx";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "accent" | "success";
  showLabel?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

const variantStyles = {
  default: "bg-[var(--color-foreground-muted)]",
  primary: "bg-[var(--color-primary)]",
  accent: "bg-[var(--color-accent)]",
  success: "bg-[var(--color-success)]",
};

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  variant = "primary",
  showLabel = false,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={clsx("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-[var(--color-foreground-muted)]">Progress</span>
          <span className="text-xs font-medium text-[var(--color-foreground)]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={clsx(
          "w-full bg-[var(--color-background-alt)] rounded-full overflow-hidden",
          sizeStyles[size]
        )}
      >
        <div
          className={clsx(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantStyles[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: "default" | "primary" | "accent" | "success";
  showLabel?: boolean;
  className?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 64,
  strokeWidth = 6,
  variant = "primary",
  showLabel = true,
  className = "",
}: ProgressRingProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    default: "var(--color-foreground-muted)",
    primary: "var(--color-primary)",
    accent: "var(--color-accent)",
    success: "var(--color-success)",
  };

  return (
    <div className={clsx("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-background-alt)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={variantColors[variant]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showLabel && (
        <span className="absolute text-sm font-semibold text-[var(--color-foreground)]">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
