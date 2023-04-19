import jwt from "jsonwebtoken";
import { authenticationSecret } from "../environment/environment.js";
import { User } from "../db/user.js";
import { genUser } from "../db/db.js";
import { genRefreshCommands } from "../commands/commands_manager.js";

export const maxExpiresInSecs = 31536000; // 1y
let currentUser: User | undefined = undefined;

export function generateAccessToken(user: User): string {
  return jwt.sign({ username: user.username }, authenticationSecret, {
    expiresIn: maxExpiresInSecs,
  });
}

export function validateAuthentication(req: any, res: any, next: any) {
  const user = req.user;

  if (user == null) return res.sendStatus(401);
  next();
}

export async function genAuthenticateUser(req: any, res: any, next: any) {
  const token = req.cookies.jwt;

  if (token == null) {
    currentUser = undefined;
    req.user = undefined;
    next();
    return;
  }

  if (currentUser != undefined) {
    req.user = currentUser;
    next();
    return;
  }
  jwt.verify(token, authenticationSecret, async (err: any, user: any) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    currentUser = await genUser(user.username);
    req.user = currentUser;
    await genRefreshCommands();
    next();
  });
}

export async function genRefreshUser(): Promise<User> {
  const loggedInUser = getLoggedInUser() as User;
  currentUser = await genUser(loggedInUser.username);
  await genRefreshCommands();
  return currentUser as User;
}

export async function genClearSession(res: any): Promise<void> {
  // Clear the JWT cookie by setting its expiration time to a past date
  res.cookie("jwt", "", { expires: new Date(0) });
  currentUser = undefined;
  await genRefreshCommands();
}

export function getLoggedInUser(): User | undefined {
  return currentUser;
}
