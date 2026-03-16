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
        {
          userAgent: "Pokedex-Crawler",
          disallow: "/",
        },
        {
          userAgent: "Deoxys-Speed",
          allow: "/api/",
          disallow: "/api/masterball",
        },
        {
          userAgent: "Team-Rocket-Bot",
          disallow: "/*",
        },
      ],
    };
}
