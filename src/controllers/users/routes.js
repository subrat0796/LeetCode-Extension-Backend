import { Router } from "express";
import controller from "./controller.js";
import { authMiddleware } from "../../middlewares/authHandler.middleware.js";

export default Router()
  .get("/get-user-details", [authMiddleware], controller.getUserDetails)
  .post("/test", (req, res, next) => {
    return res.status(200).json({ message: "This is user routes" });
  });
