import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(105/4)

// @id:march-bass
$: s("sawtooth")
  .note("c2 c2 [~ c2] c2 eb2 eb2 [~ eb2] eb2")
  .lpf(500).sustain(.12).gain(.32).room(.2)

// @id:radio-static
$: s("sine")
  .note("c1")
  .lpf(sine.range(200,800).fast(4))
  .sustain(.3).crush(3).gain(.05).room(.3)

// @id:command-beep
$: s("triangle")
  .note("~ ~ g5 ~ ~ ~ g5 ~")
  .gain(.09).sustain(.04).hpf(2000).room(.2)

// @id:march-drums
$: s("bd cp bd [cp cp]")
  .gain(.18).hpf(150).room(.2)

// @id:alarm-siren
_$: s("square")
  .note("<c5 f5 c5 f5>*2")
  .sustain(.15).gain(.13).lpf(1500).room(.3)

// @id:team-march
_$: s("bd sd [bd bd] sd")
  .gain(.28).hpf(200).room(.2)
  .off(1/8, x => x.speed(2).gain(.15))
`;

const parsed = parseStrudelScript(script);

export const rocketHQTrack: MusicTrack = {
  id: "rocket-hq",
  name: "Rocket HQ — Quartier Général",
  ...parsed,
  loop: true,
};
