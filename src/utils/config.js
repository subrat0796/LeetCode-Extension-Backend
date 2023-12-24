import "dotenv/config";
export const mongoDBUrl = process.env.MONGODB_URL;
export const port = process.env.PORT;
export const appId = process.env.APP_ID;
export const logLevel = process.env.LOG_LEVEL;
export const jwtSecret = process.env.JWT_SECRET;
export const nodeEnv = process.env.NODE_ENV;
