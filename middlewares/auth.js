import ErrorHandler from "../utils/error-handler.js";
import catchAsyncErrors from "./catch-async-error.js";
import pkg from "jsonwebtoken";
const { verify } = pkg;
import userModel from "../models/user.model.js";
import { USER_AUTH_TOKEN } from "../constants/index.js";

/**
 * Middleware to authenticate a user based on a JWT token stored in cookies.
 * Optionally checks if the user has the required role.
 *
 * @param {string|null} [requiredRole=null] - The role required to access the route. If null, no role check is performed.
 * @returns {Function} Middleware function to handle authentication.
 *
 * @throws {ErrorHandler} If the token is missing, invalid, expired, or the user does not have the required role.
 */
export const authenticate = (requiredRole = null) =>
  catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies[USER_AUTH_TOKEN];
    if (!token) {
      return next(new ErrorHandler("Please login first!", 401));
    }

    let decodedData;
    try {
      decodedData = verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return next(
        new ErrorHandler("Invalid or expired token, please login again", 401)
      );
    }

    if (!decodedData || !decodedData.id) {
      return next(new ErrorHandler("Invalid token data, please login again", 401));
    }

    const user = await userModel.findById(decodedData.id);
    if (!user) {
      return next(new ErrorHandler("User not found, please login again", 404));
    }

    // Attach user to response locals
    res.locals.user = user;

    // Check for required role (if provided)
    if (requiredRole && user.role !== requiredRole) {
      return next(
        new ErrorHandler(`Access denied: ${requiredRole} role required`, 403)
      );
    }

    next();
  });
