const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { protect, admin } = require('../middleware/authMiddleware');

// GET all news items (protected)
router.get('/', protect, newsController.getAllNews);

// GET all favorite news items (protected)
router.get('/favorites', protect, newsController.getFavorites);

// GET a single news item (protected)
router.get('/:id', protect, newsController.getNewsById);

// POST create a new news item (admin only)
router.post('/', protect, admin, newsController.createNews);

// PUT update a news item (admin only)
router.put('/:id', protect, admin, newsController.updateNews);

// DELETE a news item (admin only)
router.delete('/:id', protect, admin, newsController.deleteNews);

// POST toggle favorite status (protected)
router.post('/:id/toggle-favorite', protect, newsController.toggleFavorite);

module.exports = router;