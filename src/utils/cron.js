import { LeetCode } from "leetcode-query";
import UsersModel from "../models/users.model.js";
import l from "./logger.js";
import questionsModel from "../models/questions.model.js";
import submissionsModel from "../models/submissions.model.js";

export const fetchUserDetailsAndMapSubmissions = async () => {
  try {
    const leetcode = new LeetCode();

    // Pull all the users in my database
    const Users = await UsersModel.find({}, { leetCodeProfileUrl: 1 });
    for (const user of Users) {
      const userLeetCodeDetails = await leetcode.user(
        user.leetCodeProfileUrl.toString().split("/")[3]
      );
      const neededDetails = {
        matchedUser: {
          recentSubmissionList: userLeetCodeDetails.recentSubmissionList,
        },
      };

      const mapSubmissions = neededDetails.matchedUser.recentSubmissionList.map(
        async (submission) => {
          const questionLink = `https://leetcode.com/problems/${submission.titleSlug}/`;
          const questionInDb = await questionsModel.findOne({ questionLink });
          const submissionInDbByUser = await submissionsModel.findOne({
            questionLink: questionInDb?._id,
            userId: user?._id,
          });
          if (questionInDb && !submissionInDbByUser) {
            return {
              questionLink: questionInDb._id,
              userId: user._id,
            };
          }
        }
      );

      const resolvedSubmissions = (await Promise.all(mapSubmissions)).filter(
        (submission) => submission !== undefined
      );

      if (resolvedSubmissions.length > 0)
        await submissionsModel.insertMany(resolvedSubmissions);
    }
  } catch (error) {
    l.error(error, "FetchUserDetailsAndMapSubmissions - Cron Job");
  }
};
