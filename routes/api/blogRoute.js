const express = require("express");
const router = express.Router();
const BlogPost = require("../../models/blogPostModel");

router.get("/allblogs", async (req, res) => {
  try {
    const data = await BlogPost.find({});
    res.send(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/newpost", async (req, res) => {
  const newPost = new BlogPost({
    title: req.body.title,
    body: req.body.body,
  });
  try {
    const savedNewPost = await newPost.save();
    res.status(201).send(savedNewPost);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
