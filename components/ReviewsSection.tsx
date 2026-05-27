import { Star, Quote } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';
import type { Review } from '@/lib/strapi';

type Locale = 'es' | 'en' | 'fr' | 'it';

const HEADINGS: Record<Locale, { title: string; subtitle: string }> = {
  es: {
    title: 'Lo que dicen nuestros clientes',
    subtitle: 'Promotores, festivales y organizadores que han hecho booking de artistas con nosotros',
  },
  en: {
    title: 'What our clients say',
    subtitle: 'Promoters, festivals and organizers who have booked artists with us',
  },
  fr: {
    title: 'Ce que disent nos clients',
    subtitle: 'Promoteurs, festivals et organisateurs qui ont fait le booking d\'artistes avec nous',
  },
  it: {
    title: 'Cosa dicono i nostri clienti',
    subtitle: 'Promoter, festival e organizzatori che hanno fatto booking di artisti con noi',
  },
};

export default function ReviewsSection({ reviews, locale }: { reviews: Review[]; locale: Locale }) {
  if (!reviews.length) return null;

  const h = HEADINGS[locale];
  const featured = reviews.filter((r) => r.featured).slice(0, 6);
  const list = featured.length > 0 ? featured : reviews.slice(0, 6);

  return (
    <section className="py-12 md:py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <FadeIn direction="up">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 text-center">
            {h.title}
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-12 text-center max-w-2xl mx-auto">
            {h.subtitle}
          </p>
        </FadeIn>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" staggerDelay={0.08}>
          {list.map((r) => (
            <StaggerItem key={r.id}>
              <article className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 h-full hover:shadow-lg transition-shadow">
                <Quote className="w-6 h-6 text-amber-500 mb-3" />
                <div className="flex gap-0.5 mb-3" aria-label={`Rated ${r.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < r.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
                  &ldquo;{r.text}&rdquo;
                </p>
                <footer className="mt-auto pt-3 border-t border-gray-100">
                  <p className="font-semibold text-gray-900 text-sm">{r.author}</p>
                  {r.eventName && (
                    <p className="text-xs text-gray-500 mt-0.5">{r.eventName}</p>
                  )}
                </footer>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
