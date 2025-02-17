import { Router, Request, Response } from "express";
import authenticateToken from "../middleware/authenticateToken";
import Post from "../db/models/Post";

const router = Router();

// create post
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const post = await Post.create(req.body);

    res.status(201).json(post);
  } catch (error) {
    if ((error as Error).name === "ValidationError") {
      res.status(400).json({ error: "Invalid post data" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

// fetch individual post
router.get("/:postId", async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve post" });
  }
});

// fetch posts with filters (userId, limit, page)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { authorId, limit = "10", page = "1" } = req.query;

    if (!authorId) {
      res.status(400).json({ error: "authorId is required" });
      return;
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const posts = await Post.find({ authorId })
      .limit(limitNumber)
      .skip(skip)
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
});

export default router;
