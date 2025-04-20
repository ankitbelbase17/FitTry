import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProfileDropdown.css';

const ProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <div className="profile-icon" onClick={toggleDropdown}>
        {user.profileImages && user.profileImages.length > 0 ? (
          <img 
            src={user.profileImages[0]} 
            alt="Profile" 
            className="profile-avatar" 
          />
        ) : (
          <div className="profile-avatar-placeholder">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
      </div>
      
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
          <div className="dropdown-body">
            <ul>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/profile/images">My Images</Link></li>
              <li><Link to="/settings">Settings</Link></li>
              <li className="logout" onClick={onLogout}>Logout</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;