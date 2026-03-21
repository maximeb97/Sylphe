import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(95/4)

// @id:boss-piano
$: s("piano")
  .note("<[ab3,cb4,eb4] [gb3,bb3,db4] [ab3,cb4,eb4] [e3,ab3,b3]>")
  .sustain(.5).gain(.2).room(.4).roomsize(2)

// @id:tension-strings
$: s("sawtooth")
  .note("<[ab2,eb3] [gb2,db3]>")
  .lpf(600).sustain(1.5).attack(.8).release(1).gain(.08).room(.5).roomsize(3)

// @id:power-hum
$: s("sine")
  .note("ab1")
  .sustain(4).attack(1).release(2).gain(.12).room(.3).slow(2)

// @id:confrontation
_$: s("bd [sn bd] [bd bd] sn")
  .gain(.3).distort(.15).room(.2).hpf(150)
`;

const parsed = parseStrudelScript(script);

export const giovanniOfficeTrack: MusicTrack = {
  id: "giovanni-office",
  name: "Bureau de Giovanni — Pouvoir Obscur",
  ...parsed,
  loop: true,
};
