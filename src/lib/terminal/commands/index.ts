import { registerCommand } from "../commandRegistry";
import { lsCommand, cdCommand, pwdCommand } from "./navigation";
import { catCommand, touchCommand, mkdirCommand, rmCommand } from "./fileOps";
import {
  helpCommand,
  clearCommand,
  echoCommand,
  whoamiCommand,
  dateCommand,
  unameCommand,
  historyCommand,
} from "./system";
import {
  hackCommand,
  pokedexCommand,
  matrixCommand,
  runCommand,
  exitCommand,
} from "./special";

export function registerAllCommands() {
  // Navigation
  registerCommand(lsCommand);
  registerCommand(cdCommand);
  registerCommand(pwdCommand);

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

  // Special / Easter eggs
  registerCommand(hackCommand);
  registerCommand(pokedexCommand);
  registerCommand(matrixCommand);
  registerCommand(runCommand);
  registerCommand(exitCommand);
}
