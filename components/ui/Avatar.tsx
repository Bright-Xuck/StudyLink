import { clsx } from "clsx";
import { type ReactNode } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
  status?: "online" | "offline" | "busy" | "away";
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

const statusSizeStyles: Record<AvatarSize, string> = {
  xs: "w-1.5 h-1.5 border",
  sm: "w-2 h-2 border-[1.5px]",
  md: "w-2.5 h-2.5 border-2",
  lg: "w-3 h-3 border-2",
  xl: "w-3.5 h-3.5 border-2",
};

const statusColors = {
  online: "bg-emerald-500",
  offline: "bg-[var(--color-gray-400)]",
  busy: "bg-red-500",
  away: "bg-amber-500",
};

// Generate consistent colors from name
function getColorFromName(name: string): string {
  const colors = [
    "bg-indigo-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-violet-500",
    "bg-cyan-500",
    "bg-orange-500",
  ];
  const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

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
  status,
}: AvatarProps) {
  const initials = name ? getInitials(name) : "?";
  const bgColor = name ? getColorFromName(name) : "bg-[var(--color-gray-400)]";

  return (
    <div className={clsx("relative inline-flex flex-shrink-0", className)}>
      <div
        className={clsx(
          "rounded-full overflow-hidden flex items-center justify-center",
          "font-medium text-white",
          "ring-2 ring-white",
          sizeStyles[size],
          !src && bgColor
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
      {status && (
        <span
          className={clsx(
            "absolute bottom-0 right-0 rounded-full border-white",
            statusSizeStyles[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({
  children,
  max = 4,
  size = "md",
  className = "",
}: AvatarGroupProps) {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleAvatars = childArray.slice(0, max);
  const remaining = childArray.length - max;

  return (
    <div className={clsx("flex -space-x-2", className)}>
      {visibleAvatars.map((child, index) => (
        <div key={index} className="relative">
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={clsx(
            "rounded-full bg-[var(--color-gray-100)] border-2 border-white",
            "flex items-center justify-center font-medium text-[var(--color-text-secondary)]",
            sizeStyles[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
