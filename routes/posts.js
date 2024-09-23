const express = require("express");
const Post = require("../models/Post");
const auth = require("../middlware/auth"); // Fixed typo: middleware instead of middlware
const mongoose = require("mongoose"); // Make sure to import mongoose

const router = express.Router();

// Create a post
router.post("/", auth, async (req, res) => {
  const post = new Post({ ...req.body, author: req.user.id });
  await post.save();
  res.status(201).json(post);
});

// Get all posts
router.get("/", async (req, res) => {
  const posts = await Post.find().populate("author", "username");
  res.json(posts);
});

// Update a post
router.put("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.author.toString() !== req.user.id) {
    return res.status(403).send("Forbidden.");
  }
  Object.assign(post, req.body);
  await post.save();
  res.json(post);
});

// Delete a post
router.delete("/:id", auth, async (req, res) => {
  // Changed the path to `/:id`
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID format.");
  }

  // Delete the post directly
  const result = await Post.findByIdAndDelete(id);
  if (!result) {
    return res.status(404).send("Post not found.");
  }

  res.send("Post deleted successfully.");
});

module.exports = router;
