import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/config.js"
import { AppError } from "../utils/appError.js"

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.access_token

  if (!token) {
    return next(new AppError("Not authorized", 401))
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return next(new AppError("Invalid token or expired", 401))
  }
}
