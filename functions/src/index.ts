import * as functions from "firebase-functions";
import { app } from "./server";

export const webapp = functions.https.onRequest(app);
