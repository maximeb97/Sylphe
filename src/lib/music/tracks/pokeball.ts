import type { MusicTrack } from "../types";
import { parseStrudelScript } from "../parser";

const script = `setcpm(90/4)

// @id:capsule-hum
$: note("e2").sound("sine").gain(.1)
  .lpf(200).room(.6).roomsize(5).attack(3).release(4)

// @id:bio-pulse
$: sound("bd ~ ~ ~")
  .gain(.15).lpf(150).room(.5).roomsize(3)

// @id:creatures
$: note("<c4 e4 g4 ~ e4 c4 ~ ~>/2")
  .sound("triangle").gain(.08).delay(.5).delaytime(.25).delayfeedback(.5)
  .lpf(800).room(.8).roomsize(4)

// @id:alert
$: sound("cp*2")
  .gain(.3).hpf(2000).delay(.3).delaytime(.0833)

// @id:bio-surge
_$: note("<g4 bb4 d5 ~ g4 ~>/2")
  .sound("triangle").gain(.12).lpf(1500)
  .room(.7).roomsize(5).delay(.3).delayfeedback(.4)

// @id:biosphere-choir
_$: note("<[c4,g4] ~ [eb4,bb4] ~>/2")
  .sound("sine").gain(.07).sustain(2).attack(1).release(1.5)
  .room(.85).roomsize(6).delay(.4).delayfeedback(.45)
`;

const { preamble, sequences } = parseStrudelScript(script);

export const pokeball: MusicTrack = {
  id: "pokeball",
  name: "Interieur Pokeball — Biosphere",
  preamble,
  sequences,
  loop: true,
};
