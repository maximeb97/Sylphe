import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/rocket-hq',
                    '/giovanni-office',
                    '/mew-cloning-chamber-042',
                    '/cerulean-cave',
                ],
            },
            {
                userAgent: 'Porygon',
                allow: '/cyberspace',
            },
            {
                userAgent: 'Pikachu',
                disallow: '/pokeball',
            },
            {
                userAgent: 'Mew',
                allow: '/pokeball',
            },
            {
                userAgent: 'MissingNo',
                disallow: '/*',
                allow: '/glitch-city'
            }
        ],
        sitemap: 'https://votre-domaine.com/sitemap.xml', // Remplacez par le vrai domaine
    };
}
