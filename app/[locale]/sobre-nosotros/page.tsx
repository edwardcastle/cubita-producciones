import {useTranslations} from 'next-intl';
import {Award, Users, Globe, Music} from 'lucide-react';
import {Link} from '@/i18n/routing';

export default function SobreNosotrosPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-red-100 max-w-3xl mx-auto">
            {t('about.description')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Award className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <div className="text-4xl font-bold text-gray-900 mb-1">30+</div>
            <div className="text-gray-600">{t('about.experience')}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Users className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <div className="text-4xl font-bold text-gray-900 mb-1">100+</div>
            <div className="text-gray-600">Festivales</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Globe className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <div className="text-4xl font-bold text-gray-900 mb-1">15+</div>
            <div className="text-gray-600">Países</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Music className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <div className="text-4xl font-bold text-gray-900 mb-1">50+</div>
            <div className="text-gray-600">Artistas</div>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('about.mission')}
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              {t('about.missionText')}
            </p>
            <p className="text-lg text-gray-600">
              Desde 1993, Cubita Producciones ha sido el puente entre el talento cubano 
              y los escenarios europeos más prestigiosos. Nuestra experiencia nos permite 
              ofrecer un servicio integral que garantiza el éxito de cada presentación.
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl p-12">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">100%</div>
                <div className="text-sm text-gray-600">Profesionalidad</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">24h</div>
                <div className="text-sm text-gray-600">Respuesta</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">30+</div>
                <div className="text-sm text-gray-600">Años</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">Top</div>
                <div className="text-sm text-gray-600">Artistas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Nuestros Servicios
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Music className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Booking de Artistas
              </h3>
              <p className="text-gray-600">
                Representamos a los mejores artistas cubanos de salsa y reguetón, 
                con disponibilidad para festivales y eventos en toda Europa.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Producción de Eventos
              </h3>
              <p className="text-gray-600">
                Coordinamos todos los aspectos técnicos y logísticos para garantizar 
                presentaciones impecables.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Tours Internacionales
              </h3>
              <p className="text-gray-600">
                Organizamos giras completas por Europa, optimizando rutas y 
                maximizando la exposición de nuestros artistas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para trabajar con nosotros?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Contacta hoy mismo y descubre cómo podemos hacer de tu evento un éxito
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-50 transition-colors"
          >
            {t('nav.contact')}
          </Link>
        </div>
      </div>
    </div>
  );
}
