import { Router, Request, Response } from "express";
import User from "../db/models/User";
import * as jwt from "jsonwebtoken";

const router = Router();

// login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not set.");
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
