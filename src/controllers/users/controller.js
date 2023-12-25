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

      // Todo - After getting the list , do ensure that if the recent submission matches any question in the question bank add a submission
      // Todo - document into the database and then send also the list of questions the user has submitted from all the tables

      // Todo - Running a cron job so that I can extract the data of the users in behind the scene

      // Todo - Get all the question submitted by the user

      return res.status(200).json({
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
          recentSubmissionList: user.recentSubmissionList,
        },
      });
    } catch (error) {
      l.error(error, "[UserController - Get User Details]");
      next(error);
    }
  }
}

export default new Controller();
