'use client';

import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-card text-card-foreground py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Image
                  src={"/logo-name.png"}
                  width={100}
                  height={100}
                  alt="StudyLink"
                />
             </div>
              <span className="text-xl font-bold text-foreground">
                StudyLink
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('tagline')}
            </p>
            <div className="text-sm text-muted-foreground">
              <p className="mb-1">{t('foundedBy')}</p>
              <a 
                href="https://studylink.cm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex text-xl font-bold items-center gap-1 text-[#3d8b40] hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/btverse.png"
                  alt="StudyLink"
                  width={24}
                  height={24}
                />
                {t('bioticUniverse')}
                <ExternalLink className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('courses')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">{t('legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('disclaimer')}
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('cookies')}
                </Link>
              </li>
              <li>
                <Link
                  href="/compliance"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('compliance')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">{t('contactTitle')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <a 
                  href={`mailto:${t('email')}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('email')}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <a 
                  href={`tel:${t('phone').replace(/\s/g, '')}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('phone')}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{t('address')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <p className="text-center text-muted-foreground text-sm">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}