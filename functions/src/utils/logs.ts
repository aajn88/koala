import functions from "firebase-functions";
import { isProd } from "../environment/environment.js";

export function log(message?: any): void {
  if (isProd) {
    functions.logger.log(message);
  } else {
    console.log(message);
  }
}
