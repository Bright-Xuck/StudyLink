"use client";

import { useTranslations } from "next-intl";
import { clsx } from "clsx";

// Icons
const Icons = {
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  command: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
      <path d="M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3h12a3 3 0 003-3 3 3 0 00-3-3z" />
    </svg>
  ),
};

interface TopBarProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="h-full px-6 flex items-center justify-between gap-4">
        {/* Left - Title or Search */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {title ? (
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-[var(--color-text-primary)] truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-[var(--color-text-secondary)] truncate">
                  {subtitle}
                </p>
              )}
            </div>
          ) : (
            <SearchBar placeholder={t("common.search")} />
          )}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          {actions}
          
          {/* Search button (mobile) */}
          <button
            type="button"
            className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-gray-100)] rounded-lg transition-colors"
            aria-label={t("common.search")}
          >
            {Icons.search}
          </button>

          {/* Notifications */}
          <button
            type="button"
            className={clsx(
              "relative p-2 rounded-lg transition-colors",
              "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
              "hover:bg-[var(--color-gray-100)]"
            )}
            aria-label={t("common.notifications")}
          >
            {Icons.bell}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-error)] rounded-full ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

function SearchBar({ placeholder = "Search...", className = "" }: SearchBarProps) {
  return (
    <div className={clsx("hidden md:flex items-center max-w-md flex-1", className)}>
      <div className="relative w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
          {Icons.search}
        </span>
        <input
          type="text"
          placeholder={placeholder}
          className={clsx(
            "w-full h-9 pl-10 pr-16 text-sm rounded-lg",
            "bg-[var(--color-gray-100)] text-[var(--color-text-primary)]",
            "placeholder:text-[var(--color-text-tertiary)]",
            "border border-transparent",
            "focus:outline-none focus:bg-white focus:border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/10",
            "transition-all duration-150"
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 rounded bg-white border border-[var(--color-border)] text-[var(--color-text-tertiary)]">
          {Icons.command}
          <span className="text-xs font-medium">K</span>
        </div>
      </div>
    </div>
  );
}

// Page Header component for consistent page layouts
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function PageHeader({ title, description, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm mb-3">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.label} className="flex items-center gap-2">
              {index > 0 && <span className="text-[var(--color-text-tertiary)]">/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-[var(--color-text-tertiary)]">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-[var(--color-text-secondary)]">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
