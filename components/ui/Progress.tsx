import { clsx } from "clsx";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "success" | "warning";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const sizeStyles = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2",
};

const variantStyles = {
  default: "bg-[var(--color-gray-600)]",
  primary: "bg-[var(--color-primary)]",
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
};

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  variant = "primary",
  showLabel = false,
  label,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={clsx("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            {label || "Progress"}
          </span>
          <span className="text-xs font-semibold text-[var(--color-text-primary)]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={clsx(
          "w-full bg-[var(--color-gray-200)] rounded-full overflow-hidden",
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
  variant?: "default" | "primary" | "success";
  showLabel?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  value,
  max = 100,
  size = 72,
  strokeWidth = 6,
  variant = "primary",
  showLabel = true,
  className = "",
  children,
}: ProgressRingProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    default: "var(--color-gray-600)",
    primary: "var(--color-primary)",
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
          stroke="var(--color-gray-200)"
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
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children ? (
          children
        ) : showLabel ? (
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {Math.round(percentage)}%
          </span>
        ) : null}
      </div>
    </div>
  );
}

// Steps Progress - for multi-step flows
interface StepsProgressProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function StepsProgress({ steps, currentStep, className = "" }: StepsProgressProps) {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        
        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={clsx(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200",
                  isCompleted && "bg-[var(--color-primary)] text-white",
                  isCurrent && "bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary-light)]",
                  !isCompleted && !isCurrent && "bg-[var(--color-gray-200)] text-[var(--color-text-tertiary)]"
                )}
              >
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={clsx(
                  "text-sm font-medium hidden sm:block",
                  (isCompleted || isCurrent) ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-tertiary)]"
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={clsx(
                  "w-8 h-0.5 rounded-full",
                  isCompleted ? "bg-[var(--color-primary)]" : "bg-[var(--color-gray-200)]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
