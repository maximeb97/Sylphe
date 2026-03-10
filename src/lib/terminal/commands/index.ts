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

  // Aliases
  registerAlias("ll", "ls");
  registerAlias("dir", "ls");
  registerAlias("cls", "clear");
  registerAlias("type", "cat");
  registerAlias("more", "cat");
}
