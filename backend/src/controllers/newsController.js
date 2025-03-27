const NewsItem = require('../models/NewsItem');

// Get all news items
exports.getAllNews = async (req, res) => {
  try {
    const newsItems = await NewsItem.find().sort({ date: -1 });
    res.json(newsItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single news item
exports.getNewsById = async (req, res) => {
  try {
    const newsItem = await NewsItem.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    res.json(newsItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a news item
exports.createNews = async (req, res) => {
  try {
    const { title, summary, link } = req.body;
    
    if (!title || !summary || !link) {
      return res.status(400).json({ message: 'Title, summary, and link are required' });
    }
    
    const newsItem = new NewsItem({
      title,
      summary,
      link,
      date: new Date(),
      isFavorite: false
    });
    
    const savedItem = await newsItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a news item
exports.updateNews = async (req, res) => {
  try {
    const { title, summary, link } = req.body;
    const updatedItem = await NewsItem.findByIdAndUpdate(
      req.params.id,
      { title, summary, link },
      { new: true }
    );
    
    if (!updatedItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a news item
exports.deleteNews = async (req, res) => {
  try {
    const deletedItem = await NewsItem.findByIdAndDelete(req.params.id);
    
    if (!deletedItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    
    res.json({ message: 'News item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle favorite status
exports.toggleFavorite = async (req, res) => {
  try {
    const newsItem = await NewsItem.findById(req.params.id);
    
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    
    newsItem.isFavorite = !newsItem.isFavorite;
    const updatedItem = await newsItem.save();
    
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all favorite news items
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await NewsItem.find({ isFavorite: true }).sort({ date: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};