import express from "express";
import { Command } from "./commands/command";
import pug from "pug";
import bodyParser from "body-parser";
import { getAssetUri, isProd } from "./environment/environment";
import {
  createNewAction,
  getCommands,
  processQuery,
  refreshCommands,
} from "./commands/commands_manager";

export const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

refreshCommands();

app.get("/", (req, res) => {
  const q = req.query.q as string;
  const url = processQuery(q);
  res.redirect(url);
});

app.get("/koala", (_req, res) => {
  const templateFile = getAssetUri("table.pug");
  const template = pug.compileFile(templateFile);

  const commands = getCommands();
  const rows: string[][] = [];
  Object.values(commands).forEach((cmd: Command) => {
    rows.push([
      cmd.command,
      cmd.name,
      cmd.description,
      cmd.emptyAction,
      cmd.actionWithArguments,
    ]);
  });

  const html = template({
    cols: [
      "Command",
      "Name",
      "Description",
      "Empty Action",
      "Action with Arguments",
    ],
    rows: rows,
    showForm: !isProd,
  });

  res.send(html);
});

app.post("/koala", (req, res) => {
  const command = req.body.command;
  const newCommand = {
    command: command,
    name: req.body.name,
    description: req.body.description,
    emptyAction: req.body.emptyAction,
    actionWithArguments: req.body.actionWithArguments,
  };
  createNewAction(newCommand, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/koala");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
