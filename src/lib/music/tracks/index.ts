import type { MusicTrack } from "../types";
import { overworld } from "./overworld";
import { labAmbiance } from "./labAmbiance";
import { glitchZone } from "./glitchZone";
import { pokeball } from "./pokeball";
import { cloningChamber } from "./cloningChamber";
import { lavenderMirror } from "./lavenderMirror";
import { encounterSfx } from "./encounterSfx";
import { casinoCornerTrack } from "./casinoCorner";
import { trickHouseTrack } from "./trickHouse";
import { hallOfFameTrack } from "./hallOfFame";
import { ceruleanCaveTrack } from "./ceruleanCave";
import { mtMoonTrack } from "./mtMoon";
import { rocketHQTrack } from "./rocketHQ";
import { giovanniOfficeTrack } from "./giovanniOffice";
import { eleventhFloorTrack } from "./eleventhFloor";
import { employeeLoginTrack } from "./employeeLogin";
import { pcBillTrack } from "./pcBill";
import { museumNullTrack } from "./museumNull";
import { cyberspaceTrack } from "./cyberspace";
import { beneathStairsTrack } from "./beneathStairs";
import { whiteRoomTrack } from "./whiteRoom";
import { sfxDialogTrack } from "./sfxDialog";
import { sfxCaptureTrack } from "./sfxCapture";
import { sfxPuzzleTrack } from "./sfxPuzzle";
import { sfxGhostTrack } from "./sfxGhost";
import { sfxSlotTrack } from "./sfxSlot";
import { coldStorageTrack } from "./coldStorage";
import { silphSubwayTrack } from "./silphSubway";
import { printerRoomTrack } from "./printerRoom";

const trackMap = new Map<string, MusicTrack>();

const allTracks: MusicTrack[] = [
  overworld,
  labAmbiance,
  glitchZone,
  pokeball,
  cloningChamber,
  lavenderMirror,
  encounterSfx,
  casinoCornerTrack,
  trickHouseTrack,
  hallOfFameTrack,
  ceruleanCaveTrack,
  mtMoonTrack,
  rocketHQTrack,
  giovanniOfficeTrack,
  eleventhFloorTrack,
  employeeLoginTrack,
  pcBillTrack,
  museumNullTrack,
  cyberspaceTrack,
  beneathStairsTrack,
  whiteRoomTrack,
  sfxDialogTrack,
  sfxCaptureTrack,
  sfxPuzzleTrack,
  sfxGhostTrack,
  sfxSlotTrack,
  coldStorageTrack,
  silphSubwayTrack,
  printerRoomTrack,
];

for (const track of allTracks) {
  trackMap.set(track.id, track);
}

export function getTrackById(id: string): MusicTrack | undefined {
  return trackMap.get(id);
}

export function getAllTracks(): MusicTrack[] {
  return allTracks;
}
