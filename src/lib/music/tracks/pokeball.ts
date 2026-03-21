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
_$: sound("cp*2")
  .gain(.3).hpf(2000).delay(.3).delaytime(.0833)
`;

const { preamble, sequences } = parseStrudelScript(script);

export const pokeball: MusicTrack = {
  id: "pokeball",
  name: "Interieur Pokeball — Biosphere",
  preamble,
  sequences,
  loop: true,
};
