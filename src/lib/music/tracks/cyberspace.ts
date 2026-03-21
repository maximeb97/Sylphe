import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(130/4)

// @id:data-flow
$: s("sawtooth")
  .note("[f#3 a3 c#4 f#4]*2")
  .lpf(sine.range(600,2000).slow(4))
  .sustain(.06).gain(.15).room(.2)

// @id:pixel-rain
$: s("hh [hh hh] [~ hh] hh [hh ~] hh [hh hh] ~")
  .gain(.06).hpf(4000).crush(8).delay(.1).delayfeedback(.3).room(.15)

// @id:echo-ping
$: s("triangle")
  .note("~ [~ f#5] ~ ~ ~ [~ c#5] ~ ~")
  .gain(.08).sustain(.05).room(.7).roomsize(4).delay(.3).delayfeedback(.5)

// @id:virus-burst
_$: s("square")
  .note("f#5*8")
  .sustain(.02).gain(.1).crush(3).distort(.4).hpf(2000)
  .lpf(sine.range(1000,4000).fast(4))
`;

const parsed = parseStrudelScript(script);

export const cyberspaceTrack: MusicTrack = {
  id: "cyberspace",
  name: "Cyberspace — Réseau Porygon",
  ...parsed,
  loop: true,
};
