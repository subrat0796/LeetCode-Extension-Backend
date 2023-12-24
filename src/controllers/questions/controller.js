import UsersModel from "../../models/users.model.js";
import l from "../../utils/logger.js";
import { LeetCode } from "leetcode-query";

class AbstractController {
  async scrapeQuestions(req, res, next) {}
}

class Controller extends AbstractController {
  constructor() {
    super();
  }
  async scrapeQuestions(req, res, next) {
    try {
    } catch (error) {
      l.error(error, "[QuestionsController - Scrape Question Details]");
      next(error);
    }
  }
}

export default new Controller();
