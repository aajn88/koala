import jwt from "jsonwebtoken";
import { authenticationSecret } from "../environment/environment.js";

export const maxExpiresInSecs = 31536000; // 1y

export interface User {
  username: string;
}

export function generateAccessToken(username: string): string {
  return jwt.sign({ username: username }, authenticationSecret, {
    expiresIn: maxExpiresInSecs,
  });
}

export function authenticateToken(req: any, res: any, next: any) {
  const token = req.cookies.jwt;

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, authenticationSecret, (err: any, user: any) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

export function getLoggedInUser(req: any): User | undefined {
  const token = req.cookies.jwt;

  if (token == null) return undefined;

  const payload = jwt.verify(token, authenticationSecret);
  return payload as User | undefined;
}
