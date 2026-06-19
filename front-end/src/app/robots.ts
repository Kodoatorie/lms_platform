import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/*/pricing',
        '/*/features',
        '/*/contacts',
      ],
      disallow: [
        '/*/admin/*',
        '/*/dashboard/*',
        '/api/*',
        '/*/checkout/*/success',
        '/*/checkout/*/cancel',
      ],
    },
    sitemap: 'https://edutech.kz/sitemap.xml',
  };
}
