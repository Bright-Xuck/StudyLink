interface StatProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export function Stat({ value, label, icon, className = "" }: StatProps) {
  return (
    <div className={`text-center ${className}`}>
      {icon && <div className="text-4xl mb-3 flex justify-center">{icon}</div>}
      <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] text-transparent bg-clip-text">
        {value}
      </p>
      <p className="text-sm md:text-base text-[var(--color-foreground-muted)] mt-2 font-medium">
        {label}
      </p>
    </div>
  );
}

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureItem({
  icon,
  title,
  description,
  className = "",
}: FeatureItemProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-accent-to-secondary text-white text-xl">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-2">
          {title}
        </h3>
        <p className="text-[var(--color-foreground-muted)]">{description}</p>
      </div>
    </div>
  );
}

interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export function Tag({
  children,
  variant = "default",
  size = "md",
  removable = false,
  onRemove,
  className = "",
}: TagProps) {
  const variants = {
    default: "bg-[var(--color-background-alt)] text-[var(--color-foreground)]",
    accent: "bg-[var(--color-accent)]/10 text-[var(--color-accent)]",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
  };

  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-medium transition-smooth ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="hover:opacity-70 transition-opacity ml-1"
          aria-label="Remove tag"
        >
          ✕
        </button>
      )}
    </span>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  animated?: boolean;
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  animated = true,
  label,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[var(--color-foreground)]">
            {label}
          </span>
          <span className="text-sm font-semibold text-[var(--color-accent)]">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-accent-to-secondary transition-all duration-500 ${
            animated ? "animate-pulse" : ""
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface DividerProps {
  className?: string;
  variant?: "default" | "gradient";
}

export function Divider({ className = "", variant = "default" }: DividerProps) {
  if (variant === "gradient") {
    return (
      <div className={`h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent ${className}`} />
    );
  }

  return (
    <div className={`h-px bg-[var(--color-border)] ${className}`} />
  );
}
