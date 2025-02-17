import { Request, Response, Router } from "express";
import User from "../db/models/User";
import authenticateToken from "../middleware/authenticateToken";
import Post from "../db/models/Post";

const router = Router();

// create user
router.post("/", async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({ user });
  } catch (error) {
    if ((error as Error).name === "ValidationError") {
      res.status(400).json({ error: "Invalid user data" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

// fetch user
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

// update user
router.put(
  "/:userId",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        {
          new: true,
        }
      );

      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  }
);

// delete user
router.delete(
  "/:userId",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userDeleted = await User.findByIdAndDelete(req.params.userId);

      await Post.deleteMany({ authorId: req.params.userId });

      if (!userDeleted) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
);

export default router;
