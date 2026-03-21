import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(90/4)

// @id:boot-drive
$: s("hh [~ hh] ~ [hh hh hh ~]")
  .gain(.06).hpf(3000).crush(8).room(.1)

// @id:system-hum
$: s("sine")
  .note("d2")
  .sustain(4).attack(1.5).release(2).gain(.11).room(.2).slow(2)

// @id:data-stream
$: s("triangle")
  .note("[d4 f4 a4 d5]*2")
  .gain(.07).sustain(.04).lpf(3000).delay(.1).delayfeedback(.3).room(.2)

// @id:melody-beep
$: s("triangle")
  .note("[~ d5] ~ [~ f5] ~ [~ a5] ~ [~ d5] ~")
  .gain(.08).sustain(.04).hpf(2000).delay(.1).delayfeedback(.2).room(.15)

// @id:error-beep
_$: s("square")
  .note("[d5 ~ d5 ~] [~ ~ ~ ~] [d5 ~ d5 ~] [~ ~ ~ ~]")
  .sustain(.06).gain(.12).hpf(1500).crush(4)

// @id:file-corrupt
_$: s("square")
  .note("d6*8? d6*4? d6*2")
  .sustain(.03).gain(.09).crush(3).hpf(3000)
  .lpf(sine.range(2000, 8000).fast(8))
`;

const parsed = parseStrudelScript(script);

export const pcBillTrack: MusicTrack = {
  id: "pc-bill",
  name: "PC de Léo — Windows 95",
  ...parsed,
  loop: true,
};
