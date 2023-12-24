import l from "../../utils/logger.js";
import axios from "axios";
import cheerio from "cheerio";
import QuestionsTableModel from "../../models/questionsTable.model.js";
import QuestionsModel from "../../models/questions.model.js";

class AbstractController {
  async scrapeQuestions(req, res, next) {}
  async getAllQuestions(req, res, next) {}
}

class Controller extends AbstractController {
  constructor() {
    super();
  }
  async scrapeQuestions(req, res, next) {
    const { requestUrl } = req.body;
    try {
      const { data } = await axios.get(requestUrl);
      const $ = cheerio.load(data);

      let links = new Set();

      const questionTableAlreadyInDB = await QuestionsTableModel.findOne({
        tableName: requestUrl,
      });

      if (questionTableAlreadyInDB) {
        throw {
          status: 301,
          message: "Table already exists with the name",
        };
      }

      const questionTable = await QuestionsTableModel.create({
        tableName: requestUrl,
        tableUrl: requestUrl,
      });

      switch (requestUrl) {
        case "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/":
        case "https://takeuforward.org/interview-sheets/strivers-79-last-moment-dsa-sheet-ace-interviews/":
        case "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/":
          {
            $("a").each((index, element) => {
              const href = $(element).attr("href");

              if (href.includes("leetcode.com")) {
                links.add(href);
              }
            });
          }
          break;
      }
      // Converting the set to a normal array
      links = Array.from(links);
      links = links.map((link) => {
        return {
          questionLink: link,
          questionTable: questionTable._id,
        };
      });

      await QuestionsModel.insertMany(links);

      return res.status(200).json({
        status: 200,
        message: "Successfully scraped the website",
        data: {
          length: links.length,
          links,
        },
      });
    } catch (error) {
      l.error(error, "[QuestionsController - Scrape Question Details]");
      next(error);
    }
  }

  async getAllQuestions(req, res, next) {
    try {
      const result = await QuestionsTableModel.aggregate([
        {
          $lookup: {
            from: "questions",
            localField: "_id",
            foreignField: "questionTable",
            as: "questions",
          },
        },
        {
          $project: {
            tableName: 1,
            tableUrl: 1,
            questions: {
              $map: {
                input: "$questions",
                as: "question",
                in: "$$question.questionLink",
              },
            },
          },
        },
      ]);

      return res.status(200).json({
        status: 200,
        message: "Fetched all the questions",
        data: result,
      });
    } catch (error) {
      l.error(error, "[QuestionsController - Get All Questions]");
      next(error);
    }
  }
}

export default new Controller();
