"use client";

import { useTranslations } from "next-intl";
import { Bell, Search } from "lucide-react";
import { Avatar } from "@/components/ui";

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title }: TopBarProps) {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 h-16 bg-[var(--color-background-elevated)] border-b border-[var(--color-border)]">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Page Title / Search */}
        <div className="flex items-center gap-4 flex-1">
          {title && (
            <h1 className="text-lg font-semibold text-[var(--color-foreground)]">
              {title}
            </h1>
          )}
          <div className="hidden md:flex items-center max-w-md flex-1">
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]"
              />
              <input
                type="text"
                placeholder={t("common.search")}
                className="w-full pl-10 pr-4 py-2 text-sm bg-[var(--color-background-alt)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-alt)] rounded-[var(--radius-sm)] transition-colors duration-200"
            aria-label={t("common.notifications")}
          >
            <Bell size={20} />
            {/* Notification indicator */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-accent)] rounded-full" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-[var(--color-border)]">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-[var(--color-foreground)]">
                John Doe
              </p>
              <p className="text-xs text-[var(--color-foreground-muted)]">
                Student
              </p>
            </div>
            <Avatar name="John Doe" size="md" />
          </div>
        </div>
      </div>
    </header>
  );
}
