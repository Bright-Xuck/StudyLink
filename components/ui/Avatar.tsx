import { clsx } from "clsx";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

function getInitials(name: string): string {
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function Avatar({
  src,
  alt = "",
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const initials = name ? getInitials(name) : "?";

  return (
    <div
      className={clsx(
        "relative rounded-full overflow-hidden flex items-center justify-center",
        "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-medium",
        sizeStyles[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  className?: string;
}

export function AvatarGroup({
  children,
  max = 4,
  className = "",
}: AvatarGroupProps) {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleAvatars = childArray.slice(0, max);
  const remaining = childArray.length - max;

  return (
    <div className={clsx("flex -space-x-2", className)}>
      {visibleAvatars.map((child, index) => (
        <div key={index} className="ring-2 ring-[var(--color-background)] rounded-full">
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-10 h-10 rounded-full bg-[var(--color-background-alt)] border-2 border-[var(--color-background)] flex items-center justify-center text-xs font-medium text-[var(--color-foreground-muted)]">
          +{remaining}
        </div>
      )}
    </div>
  );
}
