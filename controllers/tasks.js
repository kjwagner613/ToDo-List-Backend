const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const task = require("../models/task.js");
const router = express.Router();

// POST - /tasks
router.post("/", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const task = await task.create(req.body);
    task._doc.author = req.user;
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// GET - /tasks
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await task
      .find({})
      .populate("author")
      .sort({ createdAt: "desc" });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// GET - /tasks/:taskId
router.get("/:taskId", verifyToken, async (req, res) => {
  try {
    const task = await task
      .findById(req.params.taskId)
      .populate(["author", "comments.author"]);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// PUT - /tasks/:taskId
router.put("/:taskId", verifyToken, async (req, res) => {
  try {
    const task = await task.findById(req.params.taskId);

    if (!task.author.equals(req.user._id)) {
      return res.status(403).send("You are not allowed to do this!");
    }

    const updatedtask = await task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    );

    updatedtask._doc.author = req.user;

    res.status(200).json(updatedtask);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// DELETE /tasks/:taskId
router.delete("/:taskId", verifyToken, async (req, res) => {
  try {
    const task = await task.findById(req.params.taskId);

    if (!task.author.equals(req.user._id)) {
      return res.status(403).send("You are not allowed to do that!");
    }

    const deletedtask = await task.findByIdAndDelete(req.params.taskId);
    res.status(200).json(deletedtask);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// POST /tasks/:taskId/comments
router.post("/:taskId/comments", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const task = await task.findById(req.params.taskId);
    task.comments.push(req.body);
    await task.save();

    const newComment = task.comments[task.comments.length - 1];

    newComment._doc.author = req.user;

    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
