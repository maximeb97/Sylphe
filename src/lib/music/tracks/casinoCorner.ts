import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(110/4)

// @id:piano-comp
$: s("piano")
  .note("<[c4,e4,g4,bb4] [f4,a4,c5,eb5] [bb3,d4,f4,ab4] [c4,e4,g4,bb4]>")
  .sustain(.4).gain(.22).room(.3).delay(.1).delaytime(.16)

// @id:bass-groove
$: s("sawtooth")
  .note("c2 [~ e2] g2 [a2 g2]")
  .lpf(600).sustain(.2).attack(.01).release(.05).gain(.3).room(.2)

// @id:casino-bells
$: s("triangle")
  .note("~ [g5 ~] ~ [e5 ~] ~ [c5 ~] ~ [a5 ~]")
  .gain(.12).sustain(.08).delay(.2).delaytime(.125).delayfeedback(.3).room(.4)

// @id:jackpot-frenzy
_$: s("square")
  .note("c5*8")
  .lpf(sine.range(500,3000).slow(2))
  .sustain(.04).gain(.15).crush(8).distort(.2).room(.2)
`;

const parsed = parseStrudelScript(script);

export const casinoCornerTrack: MusicTrack = {
  id: "casino-corner",
  name: "Casino Game Corner — Jackpot Jazz",
  ...parsed,
  loop: true,
};
