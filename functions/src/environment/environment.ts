import * as dotenv from "dotenv";

dotenv.config();

export const nodeEnv = process.env.NODE_ENV;
export const isProd = nodeEnv == "prod";

export const envBaseURL = isProd ? "/koalapp" : "";
export function adaptUrlToEnv(url: string): string {
  if (url.startsWith("/")) {
    return envBaseURL + url;
  }
  return url;
}

const assetsPath = isProd ? "src/assets/" : "functions/src/assets/";
export function getAssetUri(filename: string): string {
  return assetsPath + filename;
}
