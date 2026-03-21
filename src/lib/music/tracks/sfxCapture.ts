import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(140/4)

// @id:sfx-capture-jingle
$: s("triangle")
  .note("[c5 e5 g5 c6] [~ ~ ~ ~]")
  .sustain(.15).gain(.2).room(.4).roomsize(2)
`;

const parsed = parseStrudelScript(script);

export const sfxCaptureTrack: MusicTrack = {
  id: "sfx-capture",
  name: "SFX — Capture Réussie",
  ...parsed,
  loop: false,
};
