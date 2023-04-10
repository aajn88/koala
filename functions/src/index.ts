import * as functions from "firebase-functions";
import { app } from "./server";

export const koalapp = functions.https.onRequest(app);
