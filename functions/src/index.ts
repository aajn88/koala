import * as functions from "firebase-functions";
import { app } from "./server.js";

export const koalapp = functions.https.onRequest(app);
