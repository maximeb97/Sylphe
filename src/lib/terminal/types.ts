export type FileType = "file" | "directory";

export interface FSNode {
  name: string;
  type: FileType;
  content?: string;
  executable?: boolean;
  children?: Record<string, FSNode>;
}

export interface TerminalLine {
  id: number;
  type: "input" | "output" | "error" | "system";
  content: string;
}

export interface CommandContext {
  fs: FSNode;
  cwd: string;
  env: Record<string, string>;
  addLine: (line: Omit<TerminalLine, "id">) => void;
  setCwd: (path: string) => void;
  clearLines: () => void;
}

export interface Command {
  name: string;
  description: string;
  usage?: string;
  hidden?: boolean;
  execute: (args: string[], ctx: CommandContext) => void | Promise<void>;
}
