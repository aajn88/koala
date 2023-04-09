import fs, { NoParamCallback } from "fs";
import csv from "csv-parser";
import { Command } from "./command";
import * as dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV == "prod";

let commandsPath = "src/commands/commands_list.csv";
if (!isProd) {
  commandsPath = "functions/" + commandsPath;
}

export function readCommandsFile(): Promise<Command[]> {
  return new Promise((resolve, reject) => {
    const results: Command[] = [];
    fs.createReadStream(commandsPath)
      .pipe(csv())
      .on("data", (data: Command) => results.push(data))
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error: Error) => {
        reject(error);
      });
  });
}

export function saveNewCommand(cmd: Command, callback: NoParamCallback): void {
  const csvLine = `${cmd.command},${cmd.name},${cmd.description},${cmd.emptyAction},${cmd.actionWithArguments}\n`;
  fs.appendFile(commandsPath, csvLine, callback);
}
