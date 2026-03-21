import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(75/4)

// @id:cave-wind
$: s("sine")
  .note("e2")
  .lpf(sine.range(100,400).slow(8))
  .sustain(4).attack(2).release(2).gain(.08).room(.7).roomsize(5)

// @id:crystal-chime
$: s("triangle")
  .note("~ [e5 ~] ~ [g5 ~] ~ [b5 ~] ~ ~")
  .gain(.06).sustain(.08).room(.8).roomsize(6).delay(.4).delayfeedback(.5).slow(2)

// @id:fossil-pulse
$: s("bd ~ ~ ~")
  .gain(.1).lpf(200).room(.5).roomsize(4)

// @id:zubat-swarm
_$: s("square")
  .note("e6 [g6 f6] e6 [d6 c6]")
  .sustain(.03).gain(.06).hpf(3000).crush(6)
  .delay(.2).delayfeedback(.4).pan(sine.range(0,1).fast(3))
`;

const parsed = parseStrudelScript(script);

export const mtMoonTrack: MusicTrack = {
  id: "mt-moon",
  name: "Mont Sélénite — Caverne Fossile",
  ...parsed,
  loop: true,
};
