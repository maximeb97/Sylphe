import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(100/4)

// @id:circuit-bass
$: s("sawtooth")
  .note("<ab2 [~ ab2] eb2 [~ c2]>")
  .lpf(sine.range(400,900).slow(4))
  .sustain(.15).gain(.28).room(.2)

// @id:node-pulse
$: s("triangle")
  .note("[~ ab4] [~ c5] [~ eb5] [~ ab4]")
  .gain(.1).sustain(.06).hpf(1500).delay(.1).delayfeedback(.2).room(.2)

// @id:timer-tick
$: s("hh*8").gain(.06).hpf(5000).room(.1)

// @id:breach-alarm
_$: s("square")
  .note("<ab5 c6>*4")
  .sustain(.05).gain(.12).lpf(2000).distort(.2).room(.15)
`;

const parsed = parseStrudelScript(script);

export const eleventhFloorTrack: MusicTrack = {
  id: "eleventh-floor",
  name: "11ème Étage — Opération Sauvetage",
  ...parsed,
  loop: true,
};
