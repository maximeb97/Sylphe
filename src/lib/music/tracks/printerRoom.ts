import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(70/4)

// @id:printer-hum
$: s("sawtooth")
  .note("f#2")
  .lpf(180).sustain(6).attack(3).release(3).gain(.09).room(.6).roomsize(4).slow(2)

// @id:paper-feed
$: s("hh ~ ~ [hh hh] ~ ~ hh ~")
  .gain(.04).hpf(5500).room(.5).roomsize(3).delay(.3).delayfeedback(.3)

// @id:toner-drone
$: s("sine")
  .note("f#3")
  .lpf(sine.range(200,600).slow(10))
  .sustain(3).attack(1.5).release(1.5).gain(.05).room(.5).roomsize(4).slow(2)

// @id:ink-dot
$: s("triangle")
  .note("<f#4 ~ a4 ~ c#5 ~ ~ ~>")
  .sustain(.15).attack(.05).release(.3).gain(.04)
  .room(.6).roomsize(5).delay(.5).delayfeedback(.4)

// @id:watermark-reveal
_$: s("sine")
  .note("<[f#3,c#4] ~ [a3,e4] ~ [c#4,g#4] ~>/2")
  .sustain(1.5).attack(.8).release(1).gain(.06)
  .room(.8).roomsize(7).delay(.6).delayfeedback(.5).slow(2)

// @id:print-jam
_$: s("noise")
  .lpf(sine.range(300,1200).fast(3))
  .gain(.05).room(.3).sustain(.15).attack(.02).release(.2).fast(2)
`;

const parsed = parseStrudelScript(script);

export const printerRoomTrack: MusicTrack = {
  id: "printer-room",
  name: "Salle d'Impression — Archives Papier",
  ...parsed,
  loop: true,
};
