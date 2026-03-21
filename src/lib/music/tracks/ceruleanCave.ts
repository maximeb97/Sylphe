import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(65/4)

// @id:cave-echo
$: s("sine")
  .note("<bb2 ~ db3 ~>")
  .sustain(1.5).attack(.5).release(1).gain(.13)
  .room(.8).roomsize(6).delay(.4).delaytime(.5).delayfeedback(.4)

// @id:water-drip
$: s("hh ~ ~ [~ hh] ~ ~ ~ ~")
  .gain(.06).hpf(6000).room(.9).roomsize(8).delay(.3).delayfeedback(.5)

// @id:deep-bass
$: s("sine")
  .note("bb1")
  .sustain(4).attack(2).release(2).gain(.2).room(.4).slow(2)

// @id:cave-shimmer
$: s("triangle")
  .note("<[bb4 ~ db5] ~ ~ ~>/2")
  .gain(.05).sustain(.15).room(.85).roomsize(7).delay(.5).delayfeedback(.5)

// @id:red-battle
_$: s("bd sn [bd bd] sn")
  .gain(.3).hpf(200).distort(.2).room(.2).fast(2)

// @id:crystal-drop
_$: s("triangle")
  .note("<db5 ~ ~ ~ bb4 ~ ~ ~>")
  .sustain(.08).attack(.02).release(.3).gain(.07)
  .room(.8).roomsize(7).delay(.4).delayfeedback(.5)
`;

const parsed = parseStrudelScript(script);

export const ceruleanCaveTrack: MusicTrack = {
  id: "cerulean-cave",
  name: "Cerulean Cave — Profondeurs Azur",
  ...parsed,
  loop: true,
};
