import type { MusicTrack } from "../types";
import { parseStrudelScript } from "../parser";

const script = `setcpm(60/4)

// @id:whisper
$: note("g3").sound("sine").gain(.06)
  .lpf(300).room(.95).roomsize(8)
  .attack(3).release(5)

// @id:ghost-steps
$: sound("~ hh:4 ~ ~, ~ ~ ~ hh:2")
  .gain(.04).room(.9).roomsize(7)
  .delay(.6).delaytime(.5).delayfeedback(.7)

// @id:requiem
_$: note("<g3 bb3 d4 ~ bb3 g3 ~ ~>/4")
  .sound("triangle").gain(.05)
  .lpf(500).room(.95).roomsize(9)
  .attack(2).release(4)
`;

const { preamble, sequences } = parseStrudelScript(script);

export const lavenderMirror: MusicTrack = {
  id: "lavender-mirror",
  name: "Miroir de Lavanville — Spectral",
  preamble,
  sequences,
  loop: true,
};
