const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// GET all news items
router.get('/', newsController.getAllNews);

// GET all favorite news items
router.get('/favorites', newsController.getFavorites);

// GET a single news item
router.get('/:id', newsController.getNewsById);

// POST create a new news item
router.post('/', newsController.createNews);

// PUT update a news item
router.put('/:id', newsController.updateNews);

// DELETE a news item
router.delete('/:id', newsController.deleteNews);

// POST toggle favorite status
router.post('/:id/toggle-favorite', newsController.toggleFavorite);

module.exports = router;