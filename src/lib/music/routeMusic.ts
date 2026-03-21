import type { RouteMusicConfig } from "./types";

/**
 * Maps pathname prefixes to default music tracks and sequences.
 * The provider checks this on each route change (unless a page explicitly
 * overrides via usePageMusic).
 *
 * Order matters: first match wins. Use exact paths or startsWith prefixes.
 */
const routeMap: [string, RouteMusicConfig][] = [
  // Home page
  ["/", { trackId: "overworld" }],

  // Labs / Cloning
  ["/cloning-pod-a", { trackId: "cloning-chamber" }],
  ["/cloning-pod-b", { trackId: "cloning-chamber" }],
  ["/mew-cloning-chamber-042", { trackId: "cloning-chamber", defaultSequences: ["clone-drone", "machinery", "tension"] }],

  // Pokeball interior
  ["/pokeball", { trackId: "pokeball" }],

  // Glitch / Corruption
  ["/glitch-city", { trackId: "glitch-zone" }],

  // Ghost / Spectral — unique track
  ["/lavender-mirror", { trackId: "lavender-mirror" }],
  ["/spectre-mirror", { trackId: "lavender-mirror", defaultSequences: ["whisper", "ghost-steps"] }],

  // Each lab/corporate route gets its own track
  ["/rocket-hq", { trackId: "rocket-hq" }],
  ["/giovanni-office", { trackId: "giovanni-office" }],
  ["/11th-floor", { trackId: "eleventh-floor" }],
  ["/employee-login", { trackId: "employee-login" }],

  // Caves — unique tracks
  ["/cerulean-cave", { trackId: "cerulean-cave" }],
  ["/mt-moon-cavern", { trackId: "mt-moon" }],
  ["/beneath-stairs", { trackId: "beneath-stairs" }],

  // Unique thematic tracks
  ["/casino-game-corner", { trackId: "casino-corner" }],
  ["/trick-house-maze", { trackId: "trick-house" }],
  ["/cyberspace", { trackId: "cyberspace" }],
  ["/white-room", { trackId: "white-room" }],
  ["/museum-null", { trackId: "museum-null" }],
  ["/hall-of-fame", { trackId: "hall-of-fame" }],
  ["/pc-bill", { trackId: "pc-bill" }],
  ["/test-capture", { trackId: "overworld", defaultSequences: ["bass", "drums"] }],
];

export function getRouteMusicConfig(
  pathname: string,
): RouteMusicConfig | null {
  // Exact match first, then prefix match
  for (const [route, config] of routeMap) {
    if (route === pathname) return config;
  }
  for (const [route, config] of routeMap) {
    if (route !== "/" && pathname.startsWith(route)) return config;
  }
  return null;
}
