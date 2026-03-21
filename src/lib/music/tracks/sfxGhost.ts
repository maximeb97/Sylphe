import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(100/4)

// @id:sfx-ghost-sting
$: s("sawtooth")
  .note("[eb5 ~ b4 ~] [g4 ~ eb4 ~]")
  .sustain(.15).gain(.15).lpf(1200).room(.7).roomsize(5)
  .delay(.3).delayfeedback(.4).crush(12)
`;

const parsed = parseStrudelScript(script);

export const sfxGhostTrack: MusicTrack = {
  id: "sfx-ghost",
  name: "SFX — Spectre Détecté",
  ...parsed,
  loop: false,
};
