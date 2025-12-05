const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
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

module.exports = router;
