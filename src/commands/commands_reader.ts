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

export function saveNewCommand(newCommand: Command): void {
  const csvWriter = createObjectCsvWriter({
    path: commandsPath,
    header: [
      { id: "command", title: "command" },
      { id: "name", title: "name" },
      { id: "description", title: "description" },
      { id: "emptyAction", title: "emptyAction" },
      { id: "actionWithArguments", title: "actionWithArguments" },
    ],
  });
  csvWriter
    .writeRecords([newCommand])
    .then(() => {
      console.log("New record added to the CSV file");
    })
    .catch((err) => {
      console.error(err);
    });
}
