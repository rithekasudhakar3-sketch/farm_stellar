const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
<<<<<<< HEAD
router.post('/posts', authMiddleware, communityController.createPost);
router.get('/posts', authMiddleware, communityController.getPosts);
router.get('/posts/:id', authMiddleware, communityController.getPostById);
router.post('/posts/:id/like', authMiddleware, communityController.toggleLike);
router.post('/posts/:id/comments', authMiddleware, communityController.addComment);
router.delete('/posts/:id', authMiddleware, communityController.deletePost);
=======
router.use(authMiddleware);

// Posts
router.get('/posts', communityController.getPosts);
router.post('/posts', communityController.createPost);
router.post('/posts/:postId/like', communityController.toggleLike);
router.post('/posts/:postId/comments', communityController.addComment);

// Leaderboard
router.get('/leaderboard', communityController.getLeaderboard);

// User stats
router.get('/stats', communityController.getCommunityStats);
>>>>>>> 13e2b0a (your message)

module.exports = router;
