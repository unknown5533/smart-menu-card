const MenuItem = require('../models/MenuItem');
const { processText, generateImage } = require('../services/aiService');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const config = require('../config/config');

/**
 * Create a new menu item using AI text processing
 */
const createMenuItem = async (req, res) => {
  try {
    const { text, imageType = 'ai' } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    // 1️⃣ Extract title, description, price using Groq
    const { title, description, price } = await processText(text);

    let imageUrl = null;

    // 2️⃣ Handle image based on type
    if (imageType === 'ai') {
      // ✅ Use new free stock image function (no Hugging Face needed)
      imageUrl = await generateImage(title); // only pass title
    } else if (req.file) {
      // Uploaded file — process with sharp
      const filename = `${uuidv4()}.webp`;
      const outputPath = path.join(config.upload.path, filename);

      await sharp(req.file.path)
        .resize(800, 600, { fit: 'cover', position: 'center' })
        .webp({ quality: 80 })
        .toFile(outputPath);

      // Delete original uploaded file
      fs.unlinkSync(req.file.path);

      imageUrl = `/uploads/${filename}`;
    }

    // 3️⃣ Save new menu item
    const menuItem = new MenuItem({
      title,
      description,
      price,
      originalText: text,
      imageUrl,
      imageType
    });

    await menuItem.save();

    res.status(201).json({
      success: true,
      data: menuItem
    });

  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};




/**
 * Get all menu items
 */
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * Get a single menu item by ID
 */
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * Update a menu item
 */
const updateMenuItem = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    
    let menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    // Update fields
    if (title) menuItem.title = title;
    if (description) menuItem.description = description;
    if (price !== undefined) menuItem.price = price;
    
    await menuItem.save();
    
    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * Delete a menu item
 */
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    await menuItem.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * Generate WhatsApp share link for a menu item
 */
const shareMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    // Get base URL from request or use default
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Generate WhatsApp share link
    const shareLink = generateShareLink(menuItem, baseUrl);
    
    res.status(200).json({
      success: true,
      data: {
        shareLink
      }
    });
  } catch (error) {
    console.error('Error generating share link:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  shareMenuItem
};