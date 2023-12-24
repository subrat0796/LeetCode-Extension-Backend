import { nodeEnv } from "../utils/config.js";
import l from "../utils/logger.js";

export const checkIfNotProduction = async (req, res, next) => {
  try {
    if (nodeEnv === "production" || nodeEnv === "prod")
      throw {
        status: 404,
        message: "Route not found",
      };
    next();
  } catch (error) {
    l.error(error, "CheckIfNotProductionMiddleware");
    next(error);
  }
};
