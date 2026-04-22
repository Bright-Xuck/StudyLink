"use client";

import { createContext, useContext, useState } from "react";
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
  children: React.ReactNode;
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

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1 p-1",
        "bg-[var(--color-background-alt)] rounded-[var(--radius)]",
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function TabsTrigger({
  value,
  children,
  className = "",
  disabled = false,
}: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={clsx(
        "px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)]",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
        isActive
          ? "bg-[var(--color-background-elevated)] text-[var(--color-foreground)] shadow-sm"
          : "text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
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
      className={clsx("animate-fade-in", className)}
    >
      {children}
    </div>
  );
}
