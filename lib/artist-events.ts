export type ArtistEvent = {
  name: string;
  startDate: string;
  endDate: string;
  locationName: string;
  locationRegion: string;
  description: string;
};

export const ARTIST_EVENTS: Record<string, ArtistEvent[]> = {
  'jacob-forever': [
    {
      name: 'Jacob Forever - Gira Europa Noviembre 2026',
      startDate: '2026-11-01',
      endDate: '2026-11-30',
      locationName: 'Europe Tour 2026',
      locationRegion: 'Europe',
      description: 'Gira europea de Jacob Forever en noviembre 2026. Disponible para festivales, conciertos y eventos privados en España, Italia, Francia, Alemania, Suiza y más países. Fechas en confirmación. Solicita booking ahora.',
    },
    {
      name: 'Jacob Forever - Gira Europa Verano 2027',
      startDate: '2027-06-21',
      endDate: '2027-09-22',
      locationName: 'Europe Summer Tour 2027',
      locationRegion: 'Europe',
      description: 'Gira europea de verano 2027 de Jacob Forever. Disponibilidad para festivales de salsa y reggaeton, conciertos al aire libre y eventos privados en toda Europa. Solicita booking para asegurar fecha.',
    },
  ],
};
