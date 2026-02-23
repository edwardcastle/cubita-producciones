import { getArtists, getAboutPage, getHomePage, getContactPage, getSiteSettings } from './strapi';
import { stripMarkdown } from './utils';

type Locale = 'es' | 'en' | 'fr' | 'it';

export async function buildChatContext(locale: Locale): Promise<string> {
  const [artists, about, home, contact, settings] = await Promise.all([
    getArtists(),
    getAboutPage(),
    getHomePage(),
    getContactPage(),
    getSiteSettings(),
  ]);

  const sections: string[] = [];

  // Company info
  sections.push(`=== COMPANY INFO ===
Name: ${settings.companyName}
Email: ${settings.email}
Phone: ${settings.phone}
Location: ${settings.location}
${settings.instagram ? `Instagram: ${settings.instagram}` : ''}
${settings.facebook ? `Facebook: ${settings.facebook}` : ''}
${settings.youtube ? `YouTube: ${settings.youtube}` : ''}`);

  // About / Mission
  sections.push(`=== ABOUT ===
${about.title[locale]}
${about.missionTitle[locale]}: ${stripMarkdown(about.missionText[locale])}
Stats: ${about.stats.years}+ years, ${about.stats.festivals}+ festivals, ${about.stats.countries}+ countries, ${about.stats.artists}+ artists`);

  // Services
  const servicesText = about.services
    .map((s) => `- ${s.title[locale]}: ${stripMarkdown(s.text[locale])}`)
    .join('\n');
  sections.push(`=== SERVICES ===\n${servicesText}`);

  // Home page highlights
  sections.push(`=== HOME PAGE ===
Tagline: ${home.heroTitle[locale]}
Subtitle: ${home.heroSubtitle[locale]}
About summary: ${stripMarkdown(home.aboutText[locale])}`);

  // Artists
  const artistEntries = artists.map((a) => {
    const bio = stripMarkdown(a.bio[locale]);
    return `- ${a.name} (${a.genre})
  Bio: ${bio}
  Availability: ${a.availability}
  Travel party: ${a.travelParty} people
  ${a.instagram ? `Instagram: ${a.instagram}` : ''}
  ${a.youtube ? `YouTube: ${a.youtube}` : ''}`;
  });
  sections.push(`=== ARTISTS ===\n${artistEntries.join('\n')}`);

  // Contact info
  sections.push(`=== CONTACT ===
Email: ${contact.email}
Phone: ${contact.phone}
Location: ${contact.location}
${stripMarkdown(contact.responseTimeText[locale])}`);

  return sections.join('\n\n');
}
