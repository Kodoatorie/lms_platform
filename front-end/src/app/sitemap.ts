import { MetadataRoute } from 'next';

const BASE_URL = 'https://edutech.kz';
const LOCALES = ['ru', 'kk', 'en'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/pricing', '/features', '/contacts'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    }
  }

  // Example dynamic course (placeholder)
  sitemapEntries.push({
    url: `${BASE_URL}/ru/courses/1`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  });

  return sitemapEntries;
}
