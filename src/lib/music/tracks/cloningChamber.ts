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
$: sound("bd:5*2, ~ ~ ~ cp:3")
  .gain(.4).distort(.3)
  .hpf(1000)

// @id:clone-pulse
_$: note("<c3 ~ db3 ~ c3 ~>*2")
  .sound("sawtooth").gain(.08).crush(6).distort(.2)
  .lpf(sine.range(300, 1200).slow(4)).room(.5)

// @id:emergency-protocol
_$: note("<c5 ~ ~ f#5 ~ ~ c5 ~>")
  .sound("square").gain(.12).sustain(.1).crush(4)
  .lpf(sine.range(600, 2800).fast(4)).room(.4)
`;

const { preamble, sequences } = parseStrudelScript(script);

export const cloningChamber: MusicTrack = {
  id: "cloning-chamber",
  name: "Chambre de Clonage — Projet M",
  preamble,
  sequences,
  loop: true,
};
