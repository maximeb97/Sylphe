import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(80/4)

// @id:piano-theme
$: s("piano")
  .note("<[db4,f4,ab4] [gb4,bb4,db5] [ab4,c5,eb5] [f4,ab4,db5]>")
  .sustain(.8).gain(.2).room(.5).roomsize(3)

// @id:strings-pad
$: s("sine")
  .note("<[db3,f3,ab3] [gb3,bb3,db4]>")
  .sustain(2).attack(1).release(1.5).gain(.1).room(.6).roomsize(4)

// @id:ceremony-drums
$: s("bd ~ ~ sn ~ ~ bd [~ sn]")
  .gain(.12).room(.3).lpf(800)

// @id:corruption-glitch
_$: s("square")
  .note("db3*4")
  .sustain(.04).crush(4).distort(.5).gain(.08).hpf(1000).delay(.3).delayfeedback(.5)
`;

const parsed = parseStrudelScript(script);

export const hallOfFameTrack: MusicTrack = {
  id: "hall-of-fame",
  name: "Hall of Fame — Panthéon des Dresseurs",
  ...parsed,
  loop: true,
};
