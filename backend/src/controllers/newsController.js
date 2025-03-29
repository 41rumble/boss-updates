const NewsItem = require('../models/NewsItem');

// Get all news items
exports.getAllNews = async (req, res) => {
  try {
    const { archived, isRead, includeAll } = req.query;
    
    // Build query based on parameters
    const query = {};
    
    // If includeAll is true, don't filter by any status
    if (includeAll !== 'true') {
      // Filter by archive status if specified
      if (archived !== undefined) {
        query.isArchived = archived === 'true';
      }
      
      // Filter by read status if specified
      if (isRead !== undefined) {
        query.isRead = isRead === 'true';
      }
    }
    
    console.log('Query:', query); // Log the query for debugging
    
    const newsItems = await NewsItem.find(query).sort({ date: -1 });
    console.log(`Found ${newsItems.length} items`); // Log the number of items found
    
    res.json(newsItems);
  } catch (err) {
    console.error('Error in getAllNews:', err);
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
      isFavorite: false,
      isAdminKeeper: false,
      isArchived: false,
      isRead: false
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
    const { adminOnly, userOnly, archived } = req.query;
    
    // Build query based on parameters
    let query = {};
    
    // Filter by admin or user keepers
    if (adminOnly === 'true') {
      query.isAdminKeeper = true;
    } else if (userOnly === 'true') {
      query.isFavorite = true;
    } else {
      // By default, show items that are either user favorites or admin keepers
      query = {
        $or: [
          { isFavorite: true },
          { isAdminKeeper: true }
        ]
      };
    }
    
    // Filter by archive status if specified
    if (archived !== undefined) {
      query.isArchived = archived === 'true';
    }
    
    const favorites = await NewsItem.find(query).sort({ date: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle admin keeper status
exports.toggleAdminKeeper = async (req, res) => {
  try {
    const newsItem = await NewsItem.findById(req.params.id);
    
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    
    newsItem.isAdminKeeper = !newsItem.isAdminKeeper;
    const updatedItem = await newsItem.save();
    
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Archive a news item
exports.archiveItem = async (req, res) => {
  try {
    const newsItem = await NewsItem.findById(req.params.id);
    
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    
    newsItem.isArchived = true;
    const updatedItem = await newsItem.save();
    
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Unarchive a news item
exports.unarchiveItem = async (req, res) => {
  try {
    const newsItem = await NewsItem.findById(req.params.id);
    
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    
    newsItem.isArchived = false;
    const updatedItem = await newsItem.save();
    
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mark a news item as read
exports.markAsRead = async (req, res) => {
  try {
    const newsItem = await NewsItem.findById(req.params.id);
    
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    
    newsItem.isRead = true;
    newsItem.lastReadAt = new Date();
    const updatedItem = await newsItem.save();
    
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};