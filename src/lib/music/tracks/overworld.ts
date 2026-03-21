import type { MusicTrack } from "../types";
import { parseStrudelScript } from "../parser";

const script = `setcpm(120/4)

// @id:bass
$: note("<[c2 c3]*4 [bb1 bb2]*4 [f2 f3]*4 [eb2 eb3]*4>")
  .sound("sawtooth").lpf(800).decay(.1).sustain(.6)

// @id:chords
$: note("<c4 bb3 f4 eb4>")
  .sound("square").lpf(1200).gain(.3).attack(.05).release(.3)

// @id:drums
$: sound("bd sd bd sd, hh*8")
  .gain(.7)

// @id:melody
$: note("c5 eb5 g5 bb5 g5 eb5 c5 ~")
  .sound("triangle").lpf(2000).gain(.4).delay(.3).delaytime(.125)

// @id:percussion-fills
_$: sound("bd(3,8) [~ cp] hh(5,8)")
  .gain(.55)
  .fast(2)

// @id:fanfare
$: note("<[c5,e5,g5] ~ [f5,a5,c6] ~>/2")
  .sound("piano").gain(.18).sustain(.5).room(.4)
  .delay(.15).delayfeedback(.25)
`;

const { preamble, sequences } = parseStrudelScript(script);

export const overworld: MusicTrack = {
  id: "overworld",
  name: "Overworld — Theme Principal",
  preamble,
  sequences,
  loop: true,
};
