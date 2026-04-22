"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-background)] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <LogoSVG />
            <span className="text-xl font-bold text-[var(--color-foreground)]">
              StudyLink
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" href="/auth/login" size="sm">
              Log In
            </Button>
            <Button variant="primary" href="/auth/register" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <MenuIcon isOpen={isMenuOpen} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--color-border)]">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[var(--color-foreground-muted)] hover:text-[var(--color-accent)] transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-[var(--color-border)]">
                <Button variant="ghost" href="/auth/login" size="sm">
                  Log In
                </Button>
                <Button variant="primary" href="/auth/register" size="sm">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function LogoSVG() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" fill="var(--color-accent)" />
      <path
        d="M8 12L16 8L24 12V20L16 24L8 20V12Z"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M16 14V20" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 16H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {isOpen ? (
        <path
          d="M6 6L18 18M6 18L18 6"
          stroke="var(--color-foreground)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 6H20M4 12H20M4 18H20"
          stroke="var(--color-foreground)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
