import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SIGNING_KEY = process.env.JWT_SECRET;
if (!JWT_SIGNING_KEY) {
  throw new Error("JWT_SECRET environment variable is not set.");
}

export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ message: "Unauthorized access: Missing or invalid token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, JWT_SIGNING_KEY);
    next();
  } catch (error) {
    res.status(403).json({ message: "Forbidden access: Invalid token" });
  }
};

export default authenticateToken;
