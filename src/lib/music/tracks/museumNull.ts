import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(55/4)

// @id:void-tone
$: s("sine")
  .note("eb2")
  .sustain(6).attack(3).release(3).gain(.1).room(.9).roomsize(8).slow(2)

// @id:exhibit-echo
$: s("triangle")
  .note("~ ~ [eb4 ~] ~ ~ ~ ~ [bb4 ~]")
  .gain(.04).sustain(.1).room(.9).roomsize(6).delay(.5).delayfeedback(.6).slow(2)

// @id:curator-whisper
$: s("sine")
  .note("<eb5 ~ ~ ~>")
  .sustain(.3).attack(.2).release(.5).gain(.02).room(.8).roomsize(6).slow(4)

// @id:feather-chime
_$: s("triangle")
  .note("[eb6 gb6 bb6 eb7]")
  .sustain(.06).gain(.06).room(.7).roomsize(5).delay(.3).delayfeedback(.4).slow(2)
`;

const parsed = parseStrudelScript(script);

export const museumNullTrack: MusicTrack = {
  id: "museum-null",
  name: "Museum NULL — Exposition du Vide",
  ...parsed,
  loop: true,
};
