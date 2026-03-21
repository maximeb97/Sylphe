import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(85/4)

// @id:elevator-music
$: s("piano")
  .note("<[g3,b3,d4] [c4,e4,g4] [a3,c4,e4] [d4,f4,a4]>")
  .sustain(.6).gain(.15).room(.3).delay(.05)

// @id:keyboard-clicks
$: s("hh [~ hh] hh [hh ~ hh ~]")
  .gain(.04).hpf(6000).room(.1)

// @id:server-hum
$: s("sine")
  .note("g1")
  .sustain(4).attack(2).release(2).gain(.08).room(.2).slow(2)

// @id:access-denied
_$: s("square")
  .note("[g3 ~ g3 ~]*2")
  .sustain(.08).gain(.4).crush(6).hpf(800).distort(.3)
`;

const parsed = parseStrudelScript(script);

export const employeeLoginTrack: MusicTrack = {
  id: "employee-login",
  name: "Intranet Sylphe — Muzak Corporatif",
  ...parsed,
  loop: true,
};
