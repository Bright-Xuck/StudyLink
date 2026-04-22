"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input } from "@/components/ui";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to your backend API for authentication
    console.log("Login submitted:", formData);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <LogoSVG />
              <span className="text-2xl font-bold text-[var(--color-foreground)]">
                StudyLink
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
              Welcome back
            </h1>
            <p className="mt-2 text-[var(--color-foreground-muted)]">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="mt-2 text-right">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[var(--color-accent)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Sign In
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--color-background)] text-[var(--color-foreground-muted)]">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-[var(--color-border)] rounded-[var(--radius)] hover:bg-[var(--color-background-alt)] transition-colors"
              >
                <GoogleIcon />
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-[var(--color-border)] rounded-[var(--radius)] hover:bg-[var(--color-background-alt)] transition-colors"
              >
                <GitHubIcon />
                <span className="text-sm font-medium">GitHub</span>
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-[var(--color-foreground-muted)]">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-[var(--color-accent)] font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex flex-1 bg-[var(--color-primary)] items-center justify-center p-12">
        <div className="max-w-md text-white text-center">
          <AuthIllustration />
          <h2 className="mt-8 text-2xl font-bold">Continue Learning</h2>
          <p className="mt-4 text-slate-300">
            Pick up where you left off and keep building your skills. Your
            courses and progress are waiting for you.
          </p>
        </div>
      </div>
    </div>
  );
}

function LogoSVG() {
  return (
    <svg
      width="40"
      height="40"
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

function AuthIllustration() {
  return (
    <svg
      width="300"
      height="200"
      viewBox="0 0 300 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      {/* Person at desk */}
      <rect
        x="75"
        y="80"
        width="150"
        height="100"
        rx="8"
        fill="var(--color-primary-light)"
      />
      <rect
        x="90"
        y="95"
        width="120"
        height="70"
        rx="4"
        stroke="var(--color-accent)"
        strokeWidth="2"
      />
      {/* Screen content */}
      <rect x="100" y="105" width="60" height="6" rx="3" fill="var(--color-accent)" opacity="0.8" />
      <rect x="100" y="117" width="100" height="6" rx="3" fill="#94a3b8" opacity="0.5" />
      <rect x="100" y="129" width="80" height="6" rx="3" fill="#94a3b8" opacity="0.5" />
      <rect x="100" y="141" width="40" height="6" rx="3" fill="var(--color-accent)" opacity="0.6" />
      {/* Floating elements */}
      <circle cx="60" cy="60" r="15" fill="var(--color-accent)" opacity="0.2" />
      <circle cx="250" cy="50" r="20" fill="var(--color-accent)" opacity="0.15" />
      <rect x="230" y="140" width="30" height="30" rx="6" fill="var(--color-accent)" opacity="0.2" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
