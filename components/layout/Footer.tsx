'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {Mail, Phone} from 'lucide-react';
import {motion, useInView} from 'framer-motion';
import {useRef} from 'react';

export default function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <footer ref={ref} className="bg-gray-900 text-white">
      <motion.div
        className="max-w-7xl mx-auto px-4 py-12"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-white mb-4">
              Cubita Producciones
            </h3>
            <p className="text-gray-400">
              {t('home.about.description')}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
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
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>booking@cubitaproducciones.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+39 320 936 5048</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
        >
          <p>&copy; {currentYear} Cubita Producciones. {t('footer.rights')}.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
