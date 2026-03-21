import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(45/4)

// @id:light-piano
$: s("piano")
  .note("<[a3,c#4,e4] [d4,f#4,a4] [e4,g#4,b4] [a4,c#5,e5]>")
  .sustain(1.2).gain(.18).room(.7).roomsize(5).delay(.2).delayfeedback(.3)

// @id:ethereal-pad
$: s("sine")
  .note("<[a3,e4] [d4,a4]>")
  .sustain(4).attack(2).release(2).gain(.09).room(.8).roomsize(6).slow(2)

// @id:heartbeat
$: s("bd ~ ~ ~")
  .gain(.07).lpf(150).room(.3).slow(2)

// @id:resonance-pad
$: s("sine")
  .note("<[a2,e3] ~ [d3,a3] ~>")
  .sustain(3).attack(2).release(2).gain(.06)
  .room(.7).roomsize(5).slow(2)

// @id:reconciliation
_$: s("piano")
  .note("[a4 c#5 e5 a5] [f#4 a4 c#5 f#5]")
  .sustain(.6).gain(.15).room(.6).roomsize(4).delay(.15).delayfeedback(.2).slow(2)

// @id:archive-voice
_$: s("triangle")
  .note("<a4 c#5 e5 a5>*2")
  .sustain(.5).attack(.2).release(.8).gain(.1)
  .room(.7).roomsize(5).delay(.2).delayfeedback(.3).slow(2)
`;

const parsed = parseStrudelScript(script);

export const whiteRoomTrack: MusicTrack = {
  id: "white-room",
  name: "Salle Blanche — Transcendance",
  ...parsed,
  loop: true,
};
