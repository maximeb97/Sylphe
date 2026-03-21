import { parseStrudelScript } from "@/lib/music/parser";
import type { MusicTrack } from "@/lib/music/types";

const script = `
setcpm(120/4)

// @id:sfx-dialog-bleep
$: s("square")
  .note("[e5 g5 e5 g5] [e5 g5 e5 ~]")
  .sustain(.03).gain(.12).lpf(3000).hpf(1000)
`;

const parsed = parseStrudelScript(script);

export const sfxDialogTrack: MusicTrack = {
  id: "sfx-dialog",
  name: "SFX — Dialog Bleep",
  ...parsed,
  loop: false,
};
