export interface Artist {
  id: string;
  name: string;
  slug: string;
  genre: 'salsa' | 'reggaeton';
  bio: {
    es: string;
    en: string;
    fr: string;
  };
  availability: string;
  image: string;
  instagram?: string;
  youtube?: string;
  travelParty: number;
}

export const artists: Artist[] = [
  {
    id: '1',
    name: 'Talent Fuego',
    slug: 'talent-fuego',
    genre: 'reggaeton',
    bio: {
      es: 'Referente del reguetón cubano con millones de reproducciones y una energía explosiva en vivo. Su música conecta con audiencias de todas las edades.',
      en: 'Leading figure in Cuban reggaeton with millions of plays and explosive live energy. His music connects with audiences of all ages.',
      fr: 'Figure de proue du reggaeton cubain avec des millions d\'écoutes et une énergie explosive sur scène. Sa musique touche des publics de tous âges.'
    },
    availability: '6-22 marzo / March / mars 2025',
    image: '/artists/talent-fuego.jpg',
    travelParty: 8
  },
  {
    id: '2',
    name: 'Wildey',
    slug: 'wildey',
    genre: 'salsa',
    bio: {
      es: 'Una de las voces más potentes de la salsa cubana actual, con un show que hace vibrar al público. Su presencia escénica es incomparable.',
      en: 'One of the most powerful voices in current Cuban salsa, with a show that makes audiences vibrate. His stage presence is unmatched.',
      fr: 'L\'une des voix les plus puissantes de la salsa cubaine actuelle, avec un show qui fait vibrer le public. Sa présence scénique est incomparable.'
    },
    availability: '10-26 abril / April / avril 2025',
    image: '/artists/wildey.jpg',
    travelParty: 10
  },
  {
    id: '3',
    name: 'Ja Rulay',
    slug: 'ja-rulay',
    genre: 'reggaeton',
    bio: {
      es: 'Pionero del reguetón en Cuba, con un repertorio que toda la comunidad latina conoce. Sus hits son himnos generacionales.',
      en: 'Pioneer of reggaeton in Cuba, with a repertoire that the entire Latin community knows. His hits are generational anthems.',
      fr: 'Pionnier du reggaeton à Cuba, avec un répertoire que toute la communauté latine connaît. Ses tubes sont des hymnes générationnels.'
    },
    availability: '17 abril - 3 mayo / April-May / avril-mai 2025',
    image: '/artists/ja-rulay.jpg',
    travelParty: 7
  },
  {
    id: '4',
    name: 'Manolín El Médico de la Salsa',
    slug: 'manolin',
    genre: 'salsa',
    bio: {
      es: 'Leyenda de la salsa cubana con décadas de trayectoria internacional. Su banda ofrece una experiencia musical de primer nivel.',
      en: 'Cuban salsa legend with decades of international career. His band offers a world-class musical experience.',
      fr: 'Légende de la salsa cubaine avec des décennies de carrière internationale. Son groupe offre une expérience musicale de premier plan.'
    },
    availability: 'Mayo - Junio / May-June / Mai-Juin 2025',
    image: '/artists/manolin.jpg',
    travelParty: 12
  },
  {
    id: '5',
    name: 'Charly & Johayron',
    slug: 'charly-johayron',
    genre: 'reggaeton',
    bio: {
      es: 'El dúo del momento en el reguetón cubano, con hits virales y una conexión increíble con la audiencia joven. Energía pura en el escenario.',
      en: 'The hottest duo in Cuban reggaeton, with viral hits and incredible connection with young audiences. Pure energy on stage.',
      fr: 'Le duo du moment dans le reggaeton cubain, avec des tubes viraux et une connexion incroyable avec le jeune public. Énergie pure sur scène.'
    },
    availability: '19 junio - 6 julio / June-July / juin-juillet 2025',
    image: '/artists/charly-johayron.jpg',
    travelParty: 9
  },
  {
    id: '6',
    name: 'Jacob Forever',
    slug: 'jacob-forever',
    genre: 'reggaeton',
    bio: {
      es: '"Hasta que se seque el malecón" - uno de los artistas cubanos con mayor proyección internacional y experiencia en grandes escenarios europeos.',
      en: '"Hasta que se seque el malecón" - one of the Cuban artists with the greatest international reach and experience on major European stages.',
      fr: '"Hasta que se seque el malecón" - l\'un des artistes cubains avec la plus grande projection internationale et expérience sur les grandes scènes européennes.'
    },
    availability: '9-27 julio / July / juillet 2025',
    image: '/artists/jacob-forever.jpg',
    travelParty: 12
  }
];
