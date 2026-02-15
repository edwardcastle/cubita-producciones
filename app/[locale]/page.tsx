import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {ArrowRight, Music2, Users, Award} from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const t = useTranslations();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              {t('home.hero.subtitle')}
            </p>
            <Link 
              href="/artistas"
              className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-50 transition-colors"
            >
              {t('home.hero.cta')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 opacity-10">
          <Music2 className="w-64 h-64" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <Award className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">30+</div>
              <div className="text-gray-600">{t('about.experience')}</div>
            </div>
            <div className="p-6">
              <Users className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">6</div>
              <div className="text-gray-600">{t('artists.title')}</div>
            </div>
            <div className="p-6">
              <Music2 className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">2</div>
              <div className="text-gray-600">Géneros Musicales</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {t('home.about.title')}
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                {t('home.about.description')}
              </p>
              <Link 
                href="/sobre-nosotros"
                className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700"
              >
                {t('nav.about')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl p-12 text-center">
              <Music2 className="w-32 h-32 text-red-600 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para traer talento cubano a tu evento?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Contacta con nosotros y descubre cómo podemos hacer de tu evento una experiencia inolvidable
          </p>
          <Link 
            href="/contacto"
            className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
          >
            {t('nav.contact')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
