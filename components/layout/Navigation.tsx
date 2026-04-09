'use client';

import {useTranslations, useLocale} from 'next-intl';
import {Link, usePathname} from '@/i18n/routing';
import {Menu, X, Globe} from 'lucide-react';
import {useState, useEffect, useRef} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';

interface NavigationProps {
  logo: string | null;
}

export default function Navigation({ logo }: NavigationProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    if (langOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langOpen]);

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('artists'), href: '/artistas' },
    { name: t('about'), href: '/sobre-nosotros' },
    { name: t('contact'), href: '/contacto' },
  ];

  const languages = [
    { code: 'es', name: 'Espanol', flag: '\u{1F1EA}\u{1F1F8}' },
    { code: 'en', name: 'English', flag: '\u{1F1EC}\u{1F1E7}' },
    { code: 'fr', name: 'Francais', flag: '\u{1F1EB}\u{1F1F7}' },
    { code: 'it', name: 'Italiano', flag: '\u{1F1EE}\u{1F1F9}' },
  ];

  const handleLanguageChange = (newLocale: string) => {
    router.push(`/${newLocale}${pathname}`);
    setLangOpen(false);
  };

  return (
    <nav
      aria-label="Main navigation"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 nav-blur shadow-md'
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]">
              {logo && (
                <Image
                  src={logo}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              )}
              <span className="text-xl font-bold text-gray-900">
                Cubita Producciones
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-gray-700 hover:text-amber-600 font-medium transition-colors link-underline"
              >
                {item.name}
              </Link>
            ))}

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-amber-600 font-medium transition-colors"
                aria-label="Select language"
                aria-expanded={langOpen}
              >
                <Globe className="w-5 h-5" />
                {locale.toUpperCase()}
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 animate-dropdown">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 transition-transform duration-150 hover:translate-x-1 ${
                        locale === lang.code ? 'bg-amber-50 text-amber-600' : 'text-gray-700'
                      }`}
                    >
                      <span className="font-semibold text-sm">{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-amber-600 transition-transform active:scale-90"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden animate-mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="border-t pt-2 mt-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    handleLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center gap-2 rounded-md ${
                    locale === lang.code ? 'bg-amber-50 text-amber-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold text-sm">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
