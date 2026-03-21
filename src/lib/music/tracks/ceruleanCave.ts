import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(65/4)

// @id:cave-echo
$: s("sine")
  .note("<bb2 ~ db3 ~>")
  .sustain(1.5).attack(.5).release(1).gain(.12)
  .room(.8).roomsize(6).delay(.4).delaytime(.5).delayfeedback(.4)

// @id:water-drip
$: s("hh ~ ~ [~ hh] ~ ~ ~ ~")
  .gain(.05).hpf(6000).room(.9).roomsize(8).delay(.3).delayfeedback(.5)

// @id:deep-bass
$: s("sine")
  .note("bb1")
  .sustain(4).attack(2).release(2).gain(.18).room(.4).slow(2)

// @id:red-battle
_$: s("bd sn [bd bd] sn")
  .gain(.3).hpf(200).distort(.2).room(.2).fast(2)
`;

const parsed = parseStrudelScript(script);

export const ceruleanCaveTrack: MusicTrack = {
  id: "cerulean-cave",
  name: "Cerulean Cave — Profondeurs Azur",
  ...parsed,
  loop: true,
};
