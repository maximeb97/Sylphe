import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(160/4)

// @id:sfx-slot-whir
$: s("hh*8")
  .gain(sine.range(.02,.08).fast(4))
  .hpf(3000).crush(10).room(.1)
`;

const parsed = parseStrudelScript(script);

export const sfxSlotTrack: MusicTrack = {
  id: "sfx-slot",
  name: "SFX — Machine à Sous",
  ...parsed,
  loop: false,
};
