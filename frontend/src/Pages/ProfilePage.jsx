import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Pages/Css/ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!user) return <div className="profile-error">No user data found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button 
          className="edit-profile-btn"
          onClick={() => window.location.href = '/profile/edit'}
        >
          Edit Profile
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-section user-info">
          <h2>Account Information</h2>
          <div className="info-item">
            <span className="label">Name:</span>
            <span className="value">{user.name}</span>
          </div>
          <div className="info-item">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="label">Member Since:</span>
            <span className="value">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="profile-section">
          <h2>My Images</h2>
          <div className="image-gallery">
            {user.profileImages && user.profileImages.length > 0 ? (
              user.profileImages.map((image, index) => (
                <div className="image-item" key={index}>
                  <img src={image} alt={`Pose ${index + 1}`} />
                </div>
              ))
            ) : (
              <div className="no-images">
                <p>No images uploaded yet.</p>
                <button 
                  className="upload-images-btn"
                  onClick={() => window.location.href = '/profile/images'}
                >
                  Upload Images
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;