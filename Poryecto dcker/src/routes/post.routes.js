const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');

const prisma = new PrismaClient();
const router = express.Router();

// Validation middleware
const validatePost = [
  body('title').notEmpty().trim(),
  body('content').notEmpty().trim(),
  body('authorId').isInt(),
];

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { author: true },
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching post' });
  }
});

// Create post
router.post('/', validatePost, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await prisma.post.create({
      data: req.body,
      include: { author: true },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error creating post' });
  }
});

// Update post
router.put('/:id', validatePost, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
      include: { author: true },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error updating post' });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    await prisma.post.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post' });
  }
});

module.exports = { postRouter: router };