import { Command } from "../commands/command.js";

export interface User {
  username: string;
  password: string;
  commands: Command[];
}
