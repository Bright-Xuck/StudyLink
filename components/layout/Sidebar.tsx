"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  Users,
  User,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const t = useTranslations();
  const pathname = usePathname();

  const mainNavItems: NavItem[] = [
    {
      label: t("nav.dashboard"),
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: t("nav.subjects"),
      href: "/subjects",
      icon: <FolderOpen size={20} />,
    },
    {
      label: t("nav.courses"),
      href: "/courses",
      icon: <BookOpen size={20} />,
    },
    {
      label: t("nav.groups"),
      href: "/groups",
      icon: <Users size={20} />,
    },
  ];

  const bottomNavItems: NavItem[] = [
    {
      label: t("nav.profile"),
      href: "/profile",
      icon: <User size={20} />,
    },
    {
      label: t("nav.settings"),
      href: "/settings",
      icon: <Settings size={20} />,
    },
  ];

  const isActive = (href: string) => {
    // Remove locale prefix from pathname for comparison
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
    return pathWithoutLocale === href || pathWithoutLocale.startsWith(href + "/");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-[var(--color-sidebar)] flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-[var(--color-sidebar-hover)]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--color-accent)] flex items-center justify-center">
            <GraduationCap size={24} className="text-[var(--color-accent-foreground)]" />
          </div>
          <span className="text-xl font-semibold text-[var(--color-sidebar-foreground)]">
            StudyLink
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
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

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-[var(--color-sidebar-hover)]">
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
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-sm)] text-[var(--color-sidebar-muted)] hover:text-[var(--color-sidebar-foreground)] hover:bg-[var(--color-sidebar-hover)] transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">{t("nav.logout")}</span>
          </button>
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
      className={`flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-sm)] transition-colors duration-200 ${
        isActive
          ? "bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-foreground)]"
          : "text-[var(--color-sidebar-muted)] hover:text-[var(--color-sidebar-foreground)] hover:bg-[var(--color-sidebar-hover)]"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
