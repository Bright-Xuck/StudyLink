"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { clsx } from "clsx";

// Icons - Simple, clean SVG icons
const Icons = {
  logo: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.9" />
      <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  subjects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  ),
  courses: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <path d="M8 7h8M8 11h6" />
    </svg>
  ),
  groups: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
  progress: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
};

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const t = useTranslations();
  const pathname = usePathname();

  const mainNavItems: NavItem[] = [
    { label: t("nav.dashboard"), href: "/dashboard", icon: Icons.dashboard },
    { label: t("nav.subjects"), href: "/subjects", icon: Icons.subjects },
    { label: t("nav.courses"), href: "/courses", icon: Icons.courses },
    { label: t("nav.groups"), href: "/groups", icon: Icons.groups },
    { label: t("nav.progress"), href: "/progress", icon: Icons.progress },
  ];

  const bottomNavItems: NavItem[] = [
    { label: t("nav.profile"), href: "/profile", icon: Icons.profile },
    { label: t("nav.settings"), href: "/settings", icon: Icons.settings },
  ];

  const isActive = (href: string) => {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
    return pathWithoutLocale === href || pathWithoutLocale.startsWith(href + "/");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--color-sidebar-bg)] flex flex-col z-50">
      {/* Logo */}
      <div className="h-16 px-5 flex items-center border-b border-[var(--color-sidebar-border)]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white transition-transform group-hover:scale-105">
            {Icons.logo}
          </div>
          <span className="text-[15px] font-semibold text-[var(--color-sidebar-text)] tracking-tight">
            StudyLink
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-dark">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.href)}
            />
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-[var(--color-sidebar-border)]">
        <div className="space-y-1">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.href)}
            />
          ))}
          <button
            type="button"
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
              "text-[var(--color-sidebar-text-muted)]",
              "hover:text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)]",
              "transition-colors duration-150"
            )}
          >
            {Icons.logout}
            <span className="text-sm font-medium">{t("nav.logout")}</span>
          </button>
        </div>
      </div>

      {/* User Section */}
      <div className="px-3 pb-4">
        <div className="p-3 rounded-lg bg-[var(--color-sidebar-hover)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-sidebar-text)] truncate">
                John Doe
              </p>
              <p className="text-xs text-[var(--color-sidebar-text-muted)] truncate">
                Form 4 Student
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavLink({ href, icon, label, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150",
        isActive
          ? "bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-text)]"
          : "text-[var(--color-sidebar-text-muted)] hover:text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)]"
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
      )}
    </Link>
  );
}
