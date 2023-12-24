import mongoose, { mongo } from "mongoose";
import UsersModel from "../models/users.model.js";
import JWTService from "../utils/jwt.js";
import l from "../utils/logger.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw {
        status: 404,
        message: "Token not found",
      };
    }

    const { id } = await JWTService.verifyToken(token);
    req.user = await UsersModel.findById(id);
    next();
  } catch (error) {
    l.error(error, "AuthMiddleware");
    next(error);
  }
};
