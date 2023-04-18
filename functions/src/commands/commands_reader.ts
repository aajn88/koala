import fs, { NoParamCallback } from "fs";
import csv from "csv-parser";
import { Command } from "./command.js";
import { getAssetUri } from "../environment/environment.js";

const commandsPath = getAssetUri("commands_list.csv");

export async function readCommandsFile(): Promise<Command[]> {
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
