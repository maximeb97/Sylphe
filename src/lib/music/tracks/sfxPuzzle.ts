import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(130/4)

// @id:sfx-puzzle-chime
$: s("triangle")
  .note("[g4 b4 d5 g5] ~ ~")
  .sustain(.2).gain(.18).room(.5).roomsize(3).delay(.1).delayfeedback(.2)
`;

const parsed = parseStrudelScript(script);

export const sfxPuzzleTrack: MusicTrack = {
  id: "sfx-puzzle",
  name: "SFX — Puzzle Résolu",
  ...parsed,
  loop: false,
};
