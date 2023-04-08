import fs from "fs";
import csv from "csv-parser";
import { createObjectCsvWriter } from "csv-writer";
import { Command } from "./command";

const commandsPath = "src/commands/commands_list.csv";

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

export function saveNewCommand(cmd: Command): void {
  const csvLine = `${cmd.command},${cmd.name},${cmd.description},${cmd.emptyAction},${cmd.actionWithArguments}\n`;
  fs.appendFile(commandsPath, csvLine, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("New record added to the CSV file");
    }
  });
}
