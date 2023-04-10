import { adaptUrlToEnv, isProd } from "../environment/environment";
import { Command } from "./command";
import { readCommandsFile, saveNewCommand } from "./commands_reader";

interface Commands {
  [key: string]: Command;
}

const defaultCommand = "g";

const commands: Commands = {};

export function getCommands(): Commands {
  return commands;
}

export function refreshCommands(onComplete?: (error?: Error) => void): void {
  const onCompleteFunc = onComplete ?? function () {};
  readCommandsFile()
    .then((data: Command[]) => {
      data.forEach((command) => {
        commands[command.command] = command;
      });
      onCompleteFunc();
    })
    .catch((error: Error) => {
      console.error(error);
      onCompleteFunc(error);
    });
}

export function processQuery(q: string): string {
  const querySplit = q.split(" ");
  const cmd_str = querySplit[0];
  const cmd = commands[cmd_str];

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
    return commands[defaultCommand].actionWithArguments.replace(
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
    refreshCommands(onComplete);
  });
}
