import { Router } from "express";
import controller from "./controller.js";

export default Router()
  .get("/get-user-details", controller.signUp)
  .post("/submit-solution", controller.signIn)
  .post("/test", (req, res, next) => {
    return res.status(200).json({ message: "This is user routes" });
  });
