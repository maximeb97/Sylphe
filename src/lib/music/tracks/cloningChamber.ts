import type { MusicTrack } from "../types";
import { parseStrudelScript } from "../parser";

const script = `setcpm(100/4)

// @id:clone-drone
$: note("<c2 c2 db2 c2>").sound("sawtooth")
  .lpf(400).gain(.2).room(.7).roomsize(4)
  .attack(1).release(2)

// @id:machinery
$: sound("hh:2*8, ~ cp ~ cp")
  .gain(.25).hpf(3000).delay(.15).delaytime(.125)

// @id:tension
$: note("<c3 db3 c3 b2>/2").sound("square")
  .gain(.1).lpf(600).attack(.5).release(1)
  .room(.8).roomsize(5)

// @id:alarm
_$: sound("bd:5*2, ~ ~ ~ cp:3")
  .gain(.4).distort(.3)
  .hpf(1000)
`;

const { preamble, sequences } = parseStrudelScript(script);

export const cloningChamber: MusicTrack = {
  id: "cloning-chamber",
  name: "Chambre de Clonage — Projet M",
  preamble,
  sequences,
  loop: true,
};
