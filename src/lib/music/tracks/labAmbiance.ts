import type { MusicTrack } from "../types";
import { parseStrudelScript } from "../parser";

const script = `setcpm(70/4)

// @id:drone
$: note("c2").sound("sawtooth").lpf(300).gain(.15)
  .room(.8).roomsize(4).attack(2).release(3)

// @id:pads
$: note("<c3 eb3 g3, ab3 c4 eb4>")
  .sound("sine").gain(.12).attack(1).release(2)
  .lpf(600).room(.9).roomsize(6)

// @id:drops
_$: sound("~ hh ~ hh:3").gain(.08)
  .room(.95).roomsize(8).delay(.4).delaytime(.333)

// @id:heartbeat
_$: sound("bd ~ ~ ~, ~ ~ bd ~")
  .gain(.2).lpf(200)
`;

const { preamble, sequences } = parseStrudelScript(script);

export const labAmbiance: MusicTrack = {
  id: "lab-ambiance",
  name: "Laboratoire Sylphe — Ambiance",
  preamble,
  sequences,
  loop: true,
};
