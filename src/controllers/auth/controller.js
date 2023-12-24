import UsersModel from "../../models/users.model.js";
import JWTService from "../../utils/jwt.js";
import l from "../../utils/logger.js";
import bcrypt from "bcryptjs";

class AbstractController {
  async signUp(req, res, next) {}
  async signIn(req, res, next) {}
}

class Controller extends AbstractController {
  async signUp(req, res, next) {
    const { email, password, name, leetCodeProfileUrl } = req.body;
    try {
      const userInDb = await UsersModel.findOne({
        email,
      });
      if (userInDb) {
        throw {
          status: 404,
          message: "User Already Exists",
        };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUserInDb = await UsersModel.create({
        email,
        password: hashedPassword,
        name,
        leetCodeProfileUrl,
      });

      return res.status(200).json({
        status: 200,
        token: JWTService.generateToken({ id: newUserInDb._id }),
      });
    } catch (error) {
      l.error(error, "[Authentication Signup]");
      next(error);
    }
  }

  async signIn(req, res, next) {
    const { email, password } = req.body;
    try {
      const userInDb = await UsersModel.findOne({
        email,
      });

      if (!userInDb) {
        throw {
          status: 404,
          message: "User Does Not Exists",
        };
      }

      if (!(await bcrypt.compare(password, userInDb.password))) {
        throw {
          status: 404,
          message: "User Not Verified",
        };
      }

      return res
        .status(200)
        .json({
          status: 200,
          token: JWTService.generateToken({ id: userInDb._id }),
        });
    } catch (error) {
      l.error(error, "[Authentication Signin]");
      next(error);
    }
  }
}

export default new Controller();
