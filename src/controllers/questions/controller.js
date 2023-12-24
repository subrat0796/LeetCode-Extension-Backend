import l from "../../utils/logger.js";
import axios from "axios";

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
