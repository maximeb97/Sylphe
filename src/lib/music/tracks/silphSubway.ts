import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(95/4)

// @id:rail-rumble
$: s("sawtooth")
  .note("d2")
  .lpf(sine.range(80,250).slow(6))
  .sustain(4).attack(1).release(2).gain(.12).room(.7).roomsize(5).slow(2)

// @id:tunnel-echo
$: s("hh ~ [hh hh] ~ hh ~ ~ ~")
  .gain(.05).hpf(4000).room(.9).roomsize(8).delay(.6).delayfeedback(.55)

// @id:signal-lamp
$: s("triangle")
  .note("<d4 ~ f#4 ~ a4 ~ ~ ~>")
  .sustain(.3).attack(.1).release(.5).gain(.06)
  .room(.7).roomsize(6).delay(.4).delayfeedback(.3)

// @id:metro-beat
$: s("bd ~ ~ sn ~ ~ bd ~")
  .gain(.08).lpf(300).room(.5).roomsize(4)

// @id:phantom-wagon
_$: s("sine")
  .note("<[d3,a3] ~ [f#3,c#4] ~ [a3,e4] ~ [d4,a4] ~>/2")
  .sustain(2).attack(1).release(1.5).gain(.07)
  .room(.85).roomsize(7).delay(.5).delayfeedback(.5).slow(2)

// @id:archive-whistle
_$: s("square")
  .note("<d5 ~ ~ f#5 ~ ~ a5 ~ ~ ~ ~ ~>")
  .sustain(.15).attack(.05).release(.3).gain(.04)
  .crush(8).hpf(3000).room(.6).delay(.7).delayfeedback(.6)

// @id:emergency-brake
_$: s("noise")
  .lpf(sine.range(500,2000).fast(4))
  .gain(.06).room(.4).sustain(.2).attack(.01).release(.3).fast(2)
`;

const parsed = parseStrudelScript(script);

export const silphSubwayTrack: MusicTrack = {
  id: "silph-subway",
  name: "Tunnel Logistique — Sylphe Subway",
  ...parsed,
  loop: true,
};
