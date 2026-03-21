import type { MusicTrack } from "../types";
import { parseStrudelScript } from "../parser";

const script = `setcpm(140/4)

// @id:glitch-bass
$: note("c1 ~ c1 ~").sound("sawtooth")
  .lpf(sine.range(100, 800).slow(2))
  .distort(.8).gain(.4).crush(4)

// @id:glitch-perc
$: sound("bd:3*4, cp?0.3 hh*8? sd:2*2?0.5")
  .gain(.5).shape(.3)
  .delay(.2).delaytime(.0625).delayfeedback(.6)

// @id:noise
$: sound("white").gain(.03)
  .lpf(sine.range(200, 3000).slow(4)).coarse(4)

// @id:haunted
$: note("<c4 ~ eb4 ~ f#4 ~ c4 ~>")
  .sound("square").gain(.15).crush(6)
  .lpf(400).room(.7).roomsize(3)

// @id:signal-bleed
_$: sound("white").gain(.05).coarse(12)
  .lpf(sine.range(400, 2500).fast(8))
  .delay(.3).delayfeedback(.7).room(.4)

// @id:data-surge
_$: note("<c3 f3 c3 f#3>*4")
  .sound("sawtooth").gain(.1).crush(3).distort(.5)
  .lpf(sine.range(300, 1800).fast(6)).room(.3)
`;

const { preamble, sequences } = parseStrudelScript(script);

export const glitchZone: MusicTrack = {
  id: "glitch-zone",
  name: "Glitch City — Corruption",
  preamble,
  sequences,
  loop: true,
};
