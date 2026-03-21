import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(55/4)

// @id:void-tone
$: s("sine")
  .note("eb2")
  .sustain(6).attack(3).release(3).gain(.12).room(.9).roomsize(8).slow(2)

// @id:exhibit-echo
$: s("triangle")
  .note("~ ~ [eb4 ~] ~ ~ ~ ~ [bb4 ~]")
  .gain(.06).sustain(.12).room(.9).roomsize(6).delay(.5).delayfeedback(.6).slow(2)

// @id:curator-whisper
$: s("sine")
  .note("<eb5 ~ ~ ~>")
  .sustain(.3).attack(.2).release(.5).gain(.04).room(.8).roomsize(6).slow(4)

// @id:null-haze
$: s("sine")
  .note("<[gb2,bb2] ~ ~ ~>/2")
  .sustain(3).attack(2).release(2).gain(.06).room(.9).roomsize(7).slow(2)

// @id:feather-chime
_$: s("triangle")
  .note("[eb6 gb6 bb6 eb7]")
  .sustain(.06).gain(.08).room(.7).roomsize(5).delay(.3).delayfeedback(.4).slow(2)

// @id:null-resonance
_$: s("sine")
  .note("<eb4 gb4 bb4 eb5>*2")
  .sustain(.4).attack(.2).release(.6).gain(.07)
  .room(.9).roomsize(8).delay(.4).delayfeedback(.5)
`;

const parsed = parseStrudelScript(script);

export const museumNullTrack: MusicTrack = {
  id: "museum-null",
  name: "Museum NULL — Exposition du Vide",
  ...parsed,
  loop: true,
};
