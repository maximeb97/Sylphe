import type { MusicTrack } from "../types";
import { parseStrudelScript } from "../parser";

const script = `setcpm(60/4)

// @id:whisper
$: note("g3").sound("sine").gain(.07)
  .lpf(300).room(.95).roomsize(8)
  .attack(3).release(5)

// @id:ghost-steps
$: sound("~ hh:4 ~ ~, ~ ~ ~ hh:2")
  .gain(.05).room(.9).roomsize(7)
  .delay(.6).delaytime(.5).delayfeedback(.7)

// @id:spirit-shimmer
$: note("<g3 bb3 d4 f4>/2")
  .sound("sine").gain(.04)
  .lpf(600).room(.95).roomsize(9)
  .attack(2).release(3)

// @id:mirror-chord
$: note("<[g2,d3] ~ [bb2,f3] ~>/2")
  .sound("sine").gain(.05).sustain(3).attack(2).release(2)
  .room(.95).roomsize(9).slow(2)

// @id:requiem
_$: note("<g3 bb3 d4 ~ bb3 g3 ~ ~>/4")
  .sound("triangle").gain(.07)
  .lpf(500).room(.95).roomsize(9)
  .attack(2).release(4)

// @id:spirit-call
_$: note("<g4 bb4 ~ d5 ~ bb4 ~ ~>*2")
  .sound("square").gain(.06).crush(8)
  .lpf(800).room(.95).roomsize(9)
  .delay(.5).delaytime(.375).delayfeedback(.6)
`;

const { preamble, sequences } = parseStrudelScript(script);

export const lavenderMirror: MusicTrack = {
  id: "lavender-mirror",
  name: "Miroir de Lavanville — Spectral",
  preamble,
  sequences,
  loop: true,
};
