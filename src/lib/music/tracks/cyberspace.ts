import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(130/4)

// @id:data-flow
$: s("sawtooth")
  .note("[f#3 a3 c#4 f#4]*2")
  .lpf(sine.range(600,2000).slow(4))
  .sustain(.06).gain(.16).room(.2)

// @id:pixel-rain
$: s("hh [hh hh] [~ hh] hh [hh ~] hh [hh hh] ~")
  .gain(.07).hpf(4000).crush(8).delay(.1).delayfeedback(.3).room(.15)

// @id:echo-ping
$: s("triangle")
  .note("~ [~ f#5] ~ ~ ~ [~ c#5] ~ ~")
  .gain(.09).sustain(.05).room(.7).roomsize(4).delay(.3).delayfeedback(.5)

// @id:virus-burst
$: s("square")
  .note("f#5*8")
  .sustain(.02).gain(.1).crush(3).distort(.4).hpf(2000)
  .lpf(sine.range(1000,4000).fast(4))

// @id:net-storm
_$: s("sawtooth")
  .note("[f#4 a4 c#5]*3")
  .sustain(.04).gain(.09).crush(4).distort(.2)
  .lpf(sine.range(800, 4000).fast(6)).room(.2)

// @id:glitch-arp
_$: note("<f#5 a5 c#6 f#5>*4")
  .sound("square").gain(.07).crush(5)
  .lpf(sine.range(500,3000).fast(3))
  .delay(.125).delayfeedback(.5)
`;

const parsed = parseStrudelScript(script);

export const cyberspaceTrack: MusicTrack = {
  id: "cyberspace",
  name: "Cyberspace — Réseau Porygon",
  ...parsed,
  loop: true,
};
