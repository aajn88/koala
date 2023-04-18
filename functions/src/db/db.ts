import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { User } from "./user.js";
import bcrypt from "bcrypt";
import { getDefaultCommands } from "../commands/commands_manager.js";

initializeApp();

const db = getFirestore();

export async function signupUser(
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

export async function loginUser(
  username: string,
  password: string
): Promise<User> {
  const userDoc = await db.collection("users").doc(username).get();
  if (!userDoc.exists) {
    throw new Error("Wrong username or password.");
  }
  const user = userDoc.data() as User;
  if (await bcrypt.compare(password, user.password)) {
    return user;
  }
  throw new Error("Wrong username or password.");
}