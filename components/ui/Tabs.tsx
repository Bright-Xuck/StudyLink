"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { clsx } from "clsx";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
  onChange?: (value: string) => void;
}

export function Tabs({
  defaultValue,
  children,
  className = "",
  onChange,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleSetActiveTab = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleSetActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

type TabsListVariant = "pills" | "underline" | "boxed";

interface TabsListProps {
  children: ReactNode;
  className?: string;
  variant?: TabsListVariant;
}

export function TabsList({ children, className = "", variant = "pills" }: TabsListProps) {
  const variantStyles = {
    pills: "inline-flex items-center gap-1 p-1 bg-[var(--color-gray-100)] rounded-lg",
    underline: "flex items-center gap-6 border-b border-[var(--color-border)]",
    boxed: "inline-flex items-center border border-[var(--color-border)] rounded-lg divide-x divide-[var(--color-border)] overflow-hidden",
  };

  return (
    <div
      className={clsx(variantStyles[variant], className)}
      role="tablist"
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  variant?: TabsListVariant;
}

export function TabsTrigger({
  value,
  children,
  className = "",
  disabled = false,
  icon,
  variant = "pills",
}: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  const baseStyles = "text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    pills: clsx(
      "px-3.5 py-2 rounded-md",
      isActive
        ? "bg-white text-[var(--color-text-primary)] shadow-sm"
        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
    ),
    underline: clsx(
      "pb-3 -mb-px border-b-2",
      isActive
        ? "border-[var(--color-primary)] text-[var(--color-text-primary)]"
        : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-gray-300)]"
    ),
    boxed: clsx(
      "px-4 py-2.5",
      isActive
        ? "bg-[var(--color-gray-100)] text-[var(--color-text-primary)]"
        : "bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-gray-50)]"
    ),
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        "flex items-center gap-2",
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({
  value,
  children,
  className = "",
}: TabsContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      className={clsx("animate-fade-in-up", className)}
      style={{ animationDuration: "200ms" }}
    >
      {children}
    </div>
  );
}
