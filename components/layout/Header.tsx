'use client';

import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from "next-themes";
import { useAuth } from '@/lib/contexts/AuthProvider';
import { logoutUser as signOut } from '@/lib/actions/auth.actions';
import Link from "next/link";
import Image from "next/image";

const LOCALES = [
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
    nativeName: "English"
  },
  {
    code: "fr",
    name: "French",
    flag: "🇫🇷",
    nativeName: "Français"
  }
];

export default function Header() {
  const t = useTranslations('nav');
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as string;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, loading, refreshUser } = useAuth();

  const toggleLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    if (segments[1] && LOCALES.find(l => l.code === segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    return segments.join('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = async () => {
    try {
      await signOut(); // Call your signOut action
      refreshUser(); // Refresh user state after sign-out
      setMobileMenuOpen(false); // Close mobile menu
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-card/95 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-border shadow-sm transition-all duration-200">
      <nav className="px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href={`/`} className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Image
                src={"/studylinkfavicon.png"}
                width={100}
                height={100}
                alt="StudyLink"
              />
            </div>
            <span className="text-xl font-bold text-foreground">
              StudyLink
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href={`/`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('home')}
            </Link>
            <Link
              href={`/courses`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('courses')}
            </Link>
            <Link
              href={`/about`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('about')}
            </Link>
            <Link
              href={`/contact`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('contact')}
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link
              href={toggleLocale(locale === 'en' ? 'fr' : 'en')}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {locale === 'en' ? 'FR' : 'EN'}
            </Link>
            {loading ? (
              <span className="text-muted-foreground">Loading...</span>
            ) : user ? (
              <>
                <Link
                  href={`/dashboard`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('dashboard')}
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href={`/admin`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('admin')}
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/login`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href={`/register`}
                  className="bg-primary text-primary-foreground px-5 py-2 rounded-2xl shadow-sm hover:shadow-md hover:opacity-95 transition-all duration-200"
                >
                  {t('register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-border pt-4">
            <Link
              href={`/`}
              className="block text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('home')}
            </Link>
            <Link
              href={`/courses`}
              className="block text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('courses')}
            </Link>
            <Link
              href={`/about`}
              className="block text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('about')}
            </Link>
            <Link
              href={`/contact`}
              className="block text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('contact')}
            </Link>
            <div className="pt-4 border-t border-border space-y-3">
              <button
                onClick={() => {
                  toggleTheme();
                  setMobileMenuOpen(false);
                }}
                className="block text-sm text-muted-foreground hover:text-primary w-full text-left"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <Link
                href={toggleLocale(locale === 'en' ? 'fr' : 'en')}
                className="block text-sm text-muted-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {locale === 'en' ? 'Français' : 'English'}
              </Link>
              {loading ? (
                <span className="block text-muted-foreground">Loading...</span>
              ) : user ? (
                <>
                  <Link
                    href={`/dashboard`}
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('dashboard')}
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href={`/admin`}
                      className="block text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('admin')}
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/login`}
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href={`/register`}
                    className="block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}