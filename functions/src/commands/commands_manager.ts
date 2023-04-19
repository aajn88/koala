import { getLoggedInUser } from "../auth/auth_manager.js";
import { adaptUrlToEnv, isProd } from "../environment/environment.js";
import { Command } from "./command.js";
import { readCommandsFile, saveNewCommand } from "./commands_reader.js";

interface Commands {
  [key: string]: Command;
}

const defaultCommand = "g";

const defaultCommands: Command[] = await readCommandsFile();
let cachedCommands: Commands = {};

export function getCommands(): Commands {
  return cachedCommands;
}

export function getDefaultCommands(): Command[] {
  return defaultCommands;
}

export async function genRefreshCommands(): Promise<void> {
  const user = getLoggedInUser();
  const readCommands = user ? user.commands : await readCommandsFile();
  cachedCommands = {}; // Clear cached commands before inserting the new ones
  readCommands.forEach((command) => {
    cachedCommands[command.command] = command;
  });
}

export function processQuery(q: string): string {
  const querySplit = q.split(" ");
  const cmd_str = querySplit[0];
  const cmd = cachedCommands[cmd_str];

  const url = processCommand(cmd, q, querySplit);
  return adaptUrlToEnv(url);
}

function processCommand(
  cmd: Command,
  originalQuery: string,
  querySplit: string[]
): string {
  // Uses google by default if not command found
  if (cmd == undefined) {
    return cachedCommands[defaultCommand].actionWithArguments.replace(
      "%s",
      originalQuery
    );
  }

  if (querySplit.length > 1) {
    const real_query = originalQuery.substring(
      cmd.command.length + 1 // including the space
    );
    const encoded_query = encodeURIComponent(real_query);
    return cmd.actionWithArguments.replace("%s", encoded_query);
  } else {
    return cmd.emptyAction;
  }
}

export function createNewAction(
  newCommand: Command,
  onComplete: (err?: Error) => void
): void {
  if (isProd) {
    onComplete(new Error("Operation not allowed in prod"));
    return;
  }
  saveNewCommand(newCommand, (err) => {
    if (err) {
      console.error(err);
      onComplete(err);
      return;
    }
    console.log("New record added to the CSV file");
    genRefreshCommands()
      .then(() => onComplete())
      .catch((err) => onComplete(err));
  });
}
