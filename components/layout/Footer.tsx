'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {Mail, Phone} from 'lucide-react';
import {useRef, useEffect, useState} from 'react';

export default function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={ref} className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(20px)',
              transition: 'opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.1s, transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.1s',
            }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Cubita Producciones
            </h3>
            <p className="text-gray-400">
              {t('home.about.description')}
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(20px)',
              transition: 'opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.2s, transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.2s',
            }}
          >
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors link-underline">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/artistas" className="text-gray-400 hover:text-white transition-colors link-underline">
                  {t('nav.artists')}
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-gray-400 hover:text-white transition-colors link-underline">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors link-underline">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </nav>

          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(20px)',
              transition: 'opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.3s, transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.3s',
            }}
          >
            <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="truncate">booking@cubitaproducciones.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+39 320 936 5048</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.4s, transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.4s',
          }}
        >
          <p>&copy; {currentYear} Cubita Producciones. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  );
}
