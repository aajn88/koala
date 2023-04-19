import express from "express";
import { Command } from "./commands/command.js";
import pug from "pug";
import bodyParser from "body-parser";
import {
  adaptUrlToEnv,
  envBaseURL,
  getAssetUri,
} from "./environment/environment.js";
import {
  processQuery,
  genRefreshCommands,
  getCommands,
  genCreateNewAction,
} from "./commands/commands_manager.js";
import {
  validateAuthentication,
  genAuthenticateUser,
  generateAccessToken,
  maxExpiresInSecs,
  getLoggedInUser,
  genClearSession,
  genRefreshUser,
} from "./auth/auth_manager.js";
import cookieParser from "cookie-parser";
import { genLoginUser, genSignupUser } from "./db/db.js";
import { User } from "./db/user.js";
import { log } from "./utils/logs.js";

export const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

await genRefreshCommands();

app.get("/", genAuthenticateUser, (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  const q = req.query.q as string;
  const url = processQuery(q);
  res.redirect(url);
});

app.get("/koala", genAuthenticateUser, async (_req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  const templateFile = getAssetUri("table.pug");
  const template = pug.compileFile(templateFile);

  await genRefreshUser();
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
  const user = getLoggedInUser();

  const html = template({
    cols: [
      "Command",
      "Name",
      "Description",
      "Empty Action",
      "Action with Arguments",
    ],
    rows: rows,
    user: user,
    showLogin: false,
    envBaseURL: envBaseURL,
  });

  res.send(html);
});

app.post("/koala", genAuthenticateUser, validateAuthentication, (req, res) => {
  const command = req.body.command;
  const newCommand = {
    command: command,
    name: req.body.name,
    description: req.body.description,
    emptyAction: req.body.emptyAction,
    actionWithArguments: req.body.actionWithArguments,
  };
  genCreateNewAction(newCommand)
    .then(() => {
      res.redirect(adaptUrlToEnv("/koala"));
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/log-in", async (req, res) => {
  genLoginUser(req.body.username, req.body.password)
    .then((user: User) => processNewSession(res, user))
    .catch((err) => {
      log(err);
      res.send(err);
    });
});

app.post("/sign-up", (req, res) => {
  genSignupUser(req.body.username, req.body.password)
    .then((user: User) => processNewSession(res, user))
    .catch((err) => {
      log(err);
      res.send(err);
    });
});

function processNewSession(res: any, user: User): void {
  const token = generateAccessToken(user);
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: maxExpiresInSecs * 1000,
  });
  res.redirect(adaptUrlToEnv("/koala"));
}

app.post(
  "/log-out",
  genAuthenticateUser,
  validateAuthentication,
  async (_req, res) => {
    await genClearSession(res);

    // Send a response back to the client
    res.redirect(adaptUrlToEnv("/koala"));
  }
);

app.listen(port, () => {
  log(`Server running on port ${port}`);
});
