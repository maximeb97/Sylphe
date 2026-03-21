import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(115/4)

// @id:puzzle-bass
$: s("sawtooth")
  .note("<c3 [e3 d3] g2 [a2 b2]>")
  .lpf(700).sustain(.25).gain(.28).room(.2)

// @id:maze-melody
$: s("triangle")
  .note("e4 ~ g4 [a4 b4] c5 ~ [b4 a4] g4")
  .gain(.18).sustain(.15).lpf(2500).delay(.15).delayfeedback(.2).room(.3)

// @id:tick-tock
$: s("hh*4").gain(.1).hpf(4000).delay(.05).room(.1)

// @id:danger-trap
_$: s("bd cp bd [cp cp]")
  .gain(.35).hpf(800).distort(.3).room(.2).crush(12)
`;

const parsed = parseStrudelScript(script);

export const trickHouseTrack: MusicTrack = {
  id: "trick-house",
  name: "Trick House — Labyrinthe Piégé",
  ...parsed,
  loop: true,
};
