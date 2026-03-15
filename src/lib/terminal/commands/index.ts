import { registerCommand } from "../commandRegistry";
import { registerAlias } from "../commandRegistry";
import { lsCommand, cdCommand, pwdCommand, treeCommand, findCommand, grepCommand } from "./navigation";
import { catCommand, touchCommand, mkdirCommand, rmCommand } from "./fileOps";
import {
  helpCommand,
  clearCommand,
  echoCommand,
  whoamiCommand,
  dateCommand,
  unameCommand,
  historyCommand,
  envCommand,
  hostnameCommand,
  neofetchCommand,
} from "./system";
import {
  hackCommand,
  pokedexCommand,
  matrixCommand,
  runCommand,
  exitCommand,
  sudoCommand,
  pingCommand,
  missingnoCommand,
  rocketCommand,
  masterballCommand,
  noclipCommand,
  lsdCommand,
  bikeCommand,
  motherlodeCommand,
  doomCommand,
  coffeeCommand,
  giovanniCommand,
  prototype151Command,
  archiveDebugCommand,
  containmentCommand,
  checksumCommand,
  requiemCommand,
  inventoryCommand,
  mapCommand,
} from "./special";

export function registerAllCommands() {
  // Navigation
  registerCommand(lsCommand);
  registerCommand(cdCommand);
  registerCommand(pwdCommand);
  registerCommand(treeCommand);
  registerCommand(findCommand);
  registerCommand(grepCommand);

  // File operations
  registerCommand(catCommand);
  registerCommand(touchCommand);
  registerCommand(mkdirCommand);
  registerCommand(rmCommand);

  // System
  registerCommand(helpCommand);
  registerCommand(clearCommand);
  registerCommand(echoCommand);
  registerCommand(whoamiCommand);
  registerCommand(dateCommand);
  registerCommand(unameCommand);
  registerCommand(historyCommand);
  registerCommand(envCommand);
  registerCommand(hostnameCommand);
  registerCommand(neofetchCommand);

  // Special / Easter eggs
  registerCommand(hackCommand);
  registerCommand(pokedexCommand);
  registerCommand(matrixCommand);
  registerCommand(runCommand);
  registerCommand(exitCommand);
  registerCommand(sudoCommand);
  registerCommand(pingCommand);
  registerCommand(missingnoCommand);
  registerCommand(rocketCommand);
  registerCommand(masterballCommand);
  registerCommand(noclipCommand);
  registerCommand(lsdCommand);
  registerCommand(bikeCommand);
  registerCommand(motherlodeCommand);
  registerCommand(doomCommand);
  registerCommand(coffeeCommand);
  registerCommand(giovanniCommand);
  registerCommand(prototype151Command);
  registerCommand(archiveDebugCommand);
  registerCommand(containmentCommand);
  registerCommand(checksumCommand);
  registerCommand(requiemCommand);
  registerCommand(inventoryCommand);
  registerCommand(mapCommand);

  // Aliases
  registerAlias("ll", "ls");
  registerAlias("dir", "ls");
  registerAlias("cls", "clear");
  registerAlias("type", "cat");
  registerAlias("more", "cat");
}
