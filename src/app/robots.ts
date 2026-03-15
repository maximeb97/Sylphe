import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: [
            "/rocket-hq",
            "/giovanni-office",
            "/mew-cloning-chamber-042",
            "/cerulean-cave",
            "/hall-of-fame",
            "/beneath-stairs",
            "/white-room",
            "/museum-null",
            "/lavender-mirror",
          ],
        },
        {
          userAgent: "Porygon",
          allow: "/cyberspace",
        },
        {
          userAgent: "Pikachu",
          disallow: "/pokeball",
        },
        {
          userAgent: "Mew",
          allow: "/pokeball",
        },
        {
          userAgent: "MissingNo",
          disallow: "/*",
          allow: "/glitch-city",
        },
      ],
      sitemap: "https://votre-domaine.com/sitemap.xml", // Remplacez par le vrai domaine
    };
}
