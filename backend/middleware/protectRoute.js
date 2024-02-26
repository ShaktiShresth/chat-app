import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return next(errorHandler(401, "Unauthorized - No Token Provided!"));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(errorHandler(403, "Unauthorized - Invalid token!"));

      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};

export default protectRoute;
