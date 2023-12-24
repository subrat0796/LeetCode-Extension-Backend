import JWT from "jsonwebtoken";
import { jwtSecret } from "./config.js";

class JWTService {
  constructor() {}

  generateToken(payload) {
    return JWT.sign(payload, jwtSecret, { expiresIn: "30d" });
  }
  async verifyToken(token) {
    return JWT.verify(token, jwtSecret);
  }
}

export default new JWTService();
