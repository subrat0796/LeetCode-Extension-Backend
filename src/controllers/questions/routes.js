import { Router } from "express";
import controller from "./controller.js";
import { checkIfNotProduction } from "../../middlewares/developement.middleware.js";

export default Router()
  .post("/scrape-questions", [checkIfNotProduction], controller.scrapeQuestions)
  .post("/test", [checkIfNotProduction], (req, res, next) => {
    return res.status(200).json({
      message:
        "This is scraping routes and here I can scrape question from various sites",
    });
  });
