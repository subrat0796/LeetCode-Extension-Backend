import questionsTableModel from "../../models/questionsTable.model.js";
import usersModel from "../../models/users.model.js";
import UsersModel from "../../models/users.model.js";
import l from "../../utils/logger.js";
import { LeetCode } from "leetcode-query";

class AbstractController {
  async getUserDetails(req, res, next) {}
}

class Controller extends AbstractController {
  constructor() {
    super();
  }
  async getUserDetails(req, res, next) {
    try {
      const leetcode = new LeetCode();
      const user = await leetcode.user(
        req.user.leetCodeProfileUrl.toString().split("/")[3]
      );

      if (!user.matchedUser)
        throw {
          status: 404,
          message:
            "There is no such user please contact the admin to add the user again",
        };

      const results = await questionsTableModel.aggregate([
        {
          $lookup: {
            from: "questions",
            localField: "_id",
            foreignField: "questionTable",
            as: "questions",
          },
        },
        {
          $unwind: {
            path: "$questions",
          },
        },
        {
          $lookup: {
            from: "submissions",
            localField: "questions._id",
            foreignField: "questionLink",
            as: "submissions",
          },
        },
        {
          $unwind: {
            path: "$submissions",
          },
        },
        {
          $match: {
            "submissions.userId": req.user._id,
          },
        },
      ]);

      return res.status(200).json({
        status: 200,
        message: "Succesfully fetched the user data ",
        matchedUser: {
          username: user.matchedUser.username,
          githubUrl: user.matchedUser.githubUrl,
          profile: {
            realName: user.matchedUser.profile.realName,
            aboutMe: user.matchedUser.profile.aboutMe,
            userAvatar: user.matchedUser.profile.userAvatar,
            reputation: user.matchedUser.profile.reputation,
            ranking: user.matchedUser.profile.ranking,
          },
        },
        data: results,
      });
    } catch (error) {
      l.error(error, "[UserController - Get User Details]");
      next(error);
    }
  }
}

export default new Controller();
