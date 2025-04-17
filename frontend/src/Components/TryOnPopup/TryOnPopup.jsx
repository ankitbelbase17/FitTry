import React, { useState } from "react";
import axios from "axios";

const TryOnPopup = ({ onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    // Store file objects instead of file paths
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      try {
        console.log(selectedFiles)
        const cloudName = "dov3gyfcz"; // Replace with your actual Cloudinary cloud name
        const uploadPreset = "Ankit_tryon"; // Replace with your actual upload preset

        // Upload each file to Cloudinary and return the secure_url
        const uploadPromises = selectedFiles.map((file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", uploadPreset);
          return axios
            .post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData)
            .then((response) => response.data.secure_url);
        });

        // Wait for all uploads to complete
        const urls = await Promise.all(uploadPromises);
        console.log(urls)
        // Pass the array of Cloudinary URLs to the parent component
        onUpload(urls);
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
      }
    }
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Upload Your Images</h2>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default TryOnPopup;
