import type { MusicTrack } from "../types";
import { parseStrudelScript } from "../parser";

const script = `setcpm(130/4)

// @id:sfx-encounter
$: sound("bd:5 ~ cp ~ bd:5 ~ cp cp").gain(.5)
  .hpf(500).room(.3).roomsize(1)
`;

const { preamble, sequences } = parseStrudelScript(script);

export const encounterSfx: MusicTrack = {
  id: "encounter-sfx",
  name: "SFX — Encounter",
  preamble,
  sequences,
  loop: false,
};
