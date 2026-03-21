import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(50/4)

// @id:descent-drone
$: s("sawtooth")
  .note("c#2")
  .lpf(300).sustain(6).attack(3).release(3).gain(.12).room(.8).roomsize(6).slow(2)

// @id:stone-drip
$: s("hh ~ ~ ~ ~ ~ [~ hh] ~")
  .gain(.03).hpf(5000).room(.9).roomsize(8).delay(.5).delayfeedback(.6).slow(2)

// @id:breath
$: s("sine")
  .note("c#3")
  .lpf(sine.range(150,500).slow(8))
  .sustain(3).attack(1.5).release(1.5).gain(.04).room(.6).slow(2)

// @id:void-call
_$: s("triangle")
  .note("<c#4 ~ ~ e4 ~ ~ g#4 ~ ~>")
  .sustain(.5).attack(.3).release(.8).gain(.06)
  .room(.9).roomsize(8).delay(.6).delayfeedback(.5).slow(3)
`;

const parsed = parseStrudelScript(script);

export const beneathStairsTrack: MusicTrack = {
  id: "beneath-stairs",
  name: "Sous l'Escalier — Descente",
  ...parsed,
  loop: true,
};
