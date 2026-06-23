import 'server-only';

/**
 * Shared markdown-draft parsing used by both the blog (`docs/blog-drafts/`) and
 * the news section (`docs/news-drafts/`). Both sources use the same field format:
 *
 *   **Slug:** `my-slug`
 *   **Author:** Cubita Producciones
 *   **Reading Time:** 5
 *   **Date:** 2026-06-22
 *   ### Título (titleEs)
 *   ...content...
 *
 * CONSTRAINT: draft body content must use `##` headings only. Do NOT use `###`
 * headings or `---` horizontal rules inside any field's content — the regex
 * terminates field capture at the next `\n### ` or `\n---`.
 */

export type Locale = 'es' | 'en' | 'fr' | 'it';

const FIELD_SUFFIX: Record<Locale, string> = { es: 'Es', en: 'En', fr: 'Fr', it: 'It' };

/** Extract the text under `### <label> (<base><Suffix>)` up to the next `### ` / `---` / EOF. */
export function extractField(text: string, base: string, suffix: string): string {
  const re = new RegExp(`###[^\\n]*\\(${base}${suffix}\\)\\s*\\n([\\s\\S]*?)(?=\\n###\\s|\\n---|$)`);
  const m = text.match(re);
  return m ? m[1].trim() : '';
}

/** Read a localized field group (`<base>Es`, `<base>En`, ...) into a per-locale record. */
export function readLocale(text: string, base: string): Record<Locale, string> {
  return {
    es: extractField(text, base, FIELD_SUFFIX.es),
    en: extractField(text, base, FIELD_SUFFIX.en),
    fr: extractField(text, base, FIELD_SUFFIX.fr),
    it: extractField(text, base, FIELD_SUFFIX.it),
  };
}

/** Fallback date for drafts authored before the `**Date:**` field existed. */
export const FALLBACK_DATE = '2026-01-01';

/** Parse `**Slug:** \`x\``, `**Author:** x`, `**Reading Time:** n`, `**Date:**`/`**Updated:**`. */
export function parseMeta(text: string): {
  slug: string;
  author: string;
  readingTime: number;
  publishedAt: string;
  updatedAt: string;
} {
  const slug = text.match(/\*\*Slug:\*\*\s*`([^`]+)`/)?.[1]?.trim() ?? '';
  const author = text.match(/\*\*Author:\*\*\s*(.+)/)?.[1]?.trim() ?? 'Cubita Producciones';
  const readingTime = Number(text.match(/\*\*Reading Time:\*\*\s*(\d+)/)?.[1] ?? 5);
  const dateStr = text.match(/\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})/)?.[1] ?? FALLBACK_DATE;
  const updatedStr = text.match(/\*\*Updated:\*\*\s*(\d{4}-\d{2}-\d{2})/)?.[1] ?? dateStr;
  return {
    slug,
    author,
    readingTime,
    publishedAt: `${dateStr}T09:00:00.000Z`,
    updatedAt: `${updatedStr}T09:00:00.000Z`,
  };
}
