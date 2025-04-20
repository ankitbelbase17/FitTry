import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Pages/Css/ProfileImagePage.css';

const MAX_IMAGES = 5;

const ProfileImagesPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.profileImages) {
          setImages(response.data.profileImages);
        }
      } catch (err) {
        setError('Failed to load your images');
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, []);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (!files.length) return;
    
    // Check if adding these files would exceed the limit
    if (images.length + files.length > MAX_IMAGES) {
      setError(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }
    
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/user/upload-images', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      setImages(response.data.profileImages);
      setSuccess('Images uploaded successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/user/delete-image', {
        headers: { Authorization: `Bearer ${token}` },
        data: { imageUrl }
      });
      
      // Remove the deleted image from state
      setImages(images.filter(img => img !== imageUrl));
      setSuccess('Image deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete image');
    }
  };

  if (loading) return <div className="images-loading">Loading your images...</div>;

  return (
    <div className="profile-images-container">
      <div className="images-header">
        <h1>My Pose Images</h1>
        <p className="image-count">
          {images.length} of {MAX_IMAGES} images uploaded
        </p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="images-gallery">
        {images.map((image, index) => (
          <div className="image-card" key={index}>
            <img src={image} alt={`Pose ${index + 1}`} />
            <div className="image-overlay">
              <button 
                className="delete-image-btn"
                onClick={() => handleDeleteImage(image)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {images.length < MAX_IMAGES && (
          <div className="upload-card">
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            <label htmlFor="image-upload" className={`upload-label ${uploading ? 'uploading' : ''}`}>
              {uploading ? 'Uploading...' : 'Upload Image'}
            </label>
          </div>
        )}
      </div>
      
      <div className="upload-instructions">
        <h3>Image Guidelines</h3>
        <ul>
          <li>Upload up to 5 images in different poses for better virtual try-on results</li>
          <li>Best results with clear, well-lit photos against a plain background</li>
          <li>Front-facing pose, side profile, and 3/4 angle shots are recommended</li>
          <li>For best results, wear close-fitting, plain colored clothing</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileImagesPage;