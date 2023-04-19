import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { User } from "./user.js";
import bcrypt from "bcrypt";
import { getDefaultCommands } from "../commands/commands_manager.js";
import { Command } from "../commands/command.js";

initializeApp();

const db = getFirestore();

export async function genSignupUser(
  username: string,
  password: string
): Promise<User> {
  const userDoc = await db.collection("users").doc(username).get();
  if (userDoc.exists) {
    throw new Error("Username already exists.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user: User = {
    username: username,
    password: hashedPassword,
    commands: getDefaultCommands(),
  };
  db.collection("users").doc(username).set(user);
  return user;
}

export async function genLoginUser(
  username: string,
  password: string
): Promise<User> {
  const user = await genUser(username);
  if (!user) {
    throw new Error("Wrong username or password.");
  }
  if (await bcrypt.compare(password, user.password)) {
    return user;
  }
  throw new Error("Wrong username or password.");
}

export async function genUser(username: string): Promise<User | undefined> {
  const userDoc = await db.collection("users").doc(username).get();
  if (!userDoc.exists) {
    return undefined;
  }
  return userDoc.data() as User;
}

export async function genUpdateUserCommands(
  user: User,
  commands: Command[]
): Promise<User> {
  const userRef = db.collection("users").doc(user.username);
  await userRef.update({ commands: commands });
  return (await genUser(user.username)) as User;
}
