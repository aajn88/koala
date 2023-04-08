import express from "express";
import { readCommandsFile, saveNewCommand } from "./commands/commands_reader";
import { Command } from "./commands/command";
import pug from "pug";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

interface Commands {
  [key: string]: Command;
}

const commands: Commands = {};

function refreshCommands(): void {
  readCommandsFile()
    .then((data: Command[]) => {
      data.forEach((command) => {
        commands[command.command] = command;
      });
    })
    .catch((error: Error) => {
      console.error(error);
    });
}

refreshCommands();

app.get("/", (req, res) => {
  const q = req.query.q as string;
  const query_split = q.split(" ");
  const cmd_str = query_split[0];
  const cmd = commands[cmd_str];
  if (query_split.length > 1) {
    const real_query = q.substring(cmd_str.length + 1); // including the space
    const encoded_query = encodeURIComponent(real_query);
    res.redirect(cmd.actionWithArguments.replace("%s", encoded_query));
  } else {
    res.redirect(cmd.emptyAction);
  }
});

app.get("/koala", (req, res) => {
  const template = pug.compileFile("src/template/table.pug");

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
  saveNewCommand(newCommand, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("New record added to the CSV file");
    }
    refreshCommands();
    res.redirect("/koala");
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
