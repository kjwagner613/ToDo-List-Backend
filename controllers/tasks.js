const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Task = require("../models/task.js");
const router = express.Router();


router.post("/", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const task = await Task.create(req.body);
    task._doc.author = req.user;
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate("author")
      .sort({ createdAt: "desc" });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


router.get("/:taskId", verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).populate([
      "author",
      "comments.author",
    ]);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


router.put("/:taskId", verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task.author.equals(req.user._id)) {
      return res.status(403).send("You are not allowed to do this!");
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    );

    updatedTask._doc.author = req.user;

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


router.delete("/:taskId", verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task.author.equals(req.user._id)) {
      return res.status(403).send("You are not allowed to do that!");
    }

    const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json(deletedTask);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


router.post("/:taskId/comments", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const task = await Task.findById(req.params.taskId);
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