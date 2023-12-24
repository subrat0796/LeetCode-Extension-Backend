import pino from "pino";
import { appId, logLevel } from "./config.js";

const l = pino({
  name: appId,
  level: logLevel,
});

export default l;
