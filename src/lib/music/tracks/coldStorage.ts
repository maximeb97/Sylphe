import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(40/4)

// @id:cryo-hum
$: s("sawtooth")
  .note("a1")
  .lpf(200).sustain(8).attack(4).release(4).gain(.10).room(.9).roomsize(9).slow(3)

// @id:ice-drip
$: s("hh ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ [~ hh] ~ ~ ~ ~")
  .gain(.03).hpf(7000).room(.95).roomsize(10).delay(.7).delayfeedback(.7).slow(3)

// @id:frozen-breath
$: s("sine")
  .note("e3")
  .lpf(sine.range(100,350).slow(12))
  .sustain(4).attack(2).release(2).gain(.05).room(.8).roomsize(7).slow(3)

// @id:server-pulse
$: s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~")
  .gain(.04).lpf(80).room(.6).roomsize(5).slow(2)

// @id:glacier-tone
_$: s("triangle")
  .note("<a3 ~ ~ c#4 ~ ~ e4 ~ ~ ~ ~>")
  .sustain(1).attack(.6).release(1.2).gain(.06)
  .room(.95).roomsize(10).delay(.8).delayfeedback(.6).slow(4)

// @id:thaw-signal
_$: s("square")
  .note("<[a3,e4] ~ [c#4,g#4] ~ [e4,b4] ~>/2")
  .sustain(.4).attack(.2).release(.5).gain(.05)
  .crush(6).room(.7).roomsize(6).delay(.5).delayfeedback(.4)

// @id:cryo-alarm
_$: s("sine")
  .note("<a5 e5 a5 ~ ~ ~ ~>")
  .sustain(.1).attack(.01).release(.15).gain(.08)
  .hpf(4000).room(.5).fast(2)
`;

const parsed = parseStrudelScript(script);

export const coldStorageTrack: MusicTrack = {
  id: "cold-storage",
  name: "Chambre Froide — Cryo Archive",
  ...parsed,
  loop: true,
};
