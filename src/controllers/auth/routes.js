import { Router } from "express";
import controller from "./controller.js";

export default Router()
  .post("/sign-up", controller.signUp)
  .post("/sign-in", controller.signIn)
  .post("/test", (req, res, next) => {
    return res.status(200).json({ message: "This is authentication routes" });
  });
