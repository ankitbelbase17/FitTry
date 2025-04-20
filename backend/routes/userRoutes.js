const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');
const User = require('../models/User');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    // Remove password from the response
    const user = req.user.toObject();
    delete user.password;
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload profile images
router.post('/upload-images', auth, upload.array('images', 5), async (req, res) => {
  try {
    // Get current user
    const user = await User.findById(req.user._id);
    
    // Check if adding new images would exceed the limit
    const totalImages = user.profileImages.length + req.files.length;
    if (totalImages > 5) {
      return res.status(400).json({ 
        message: 'Cannot upload more than 5 images in total'
      });
    }
    
    // Extract image URLs from uploaded files
    const newImageUrls = req.files.map(file => file.path);
    
    // Add new images to user's profileImages array
    user.profileImages = [...user.profileImages, ...newImageUrls];
    await user.save();
    
    res.status(200).json({
      message: 'Images uploaded successfully',
      profileImages: user.profileImages
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Delete profile image
router.delete('/delete-image', auth, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }
    
    // Get current user
    const user = await User.findById(req.user._id);
    
    // Check if image exists in user's profile
    if (!user.profileImages.includes(imageUrl)) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Extract public_id from the Cloudinary URL
    const publicId = imageUrl.split('/').pop().split('.')[0];
    
    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(`virtual-tryon/profiles/${publicId}`);
    
    // Remove image URL from user's profileImages array
    user.profileImages = user.profileImages.filter(img => img !== imageUrl);
    await user.save();
    
    res.status(200).json({
      message: 'Image deleted successfully',
      profileImages: user.profileImages
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

module.exports = router;
