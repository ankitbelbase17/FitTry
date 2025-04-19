import React, { useState , useContext } from "react";
import axios from "axios";
import { TryOnContext } from "../../Context/TryOnContextProvider";

// onUploadCloth,
const TryOnPopup = ({ onClose,  onUploadPerson }) => {
  const [clothFile, setClothFile] = useState(null);
  const [personFile, setPersonFile] = useState(null);

  const { toggleTryOn , clothImage } = useContext(TryOnContext);

  const handleUpload = async () => {
    // if (!clothFile || !personFile) {
    //   alert("Please select both a cloth image and a person image.");
    //   return;
    // }
    if (!personFile) {
      alert("Please select person images.");
      return;
    }

    try {
      const cloudName = "dxolqndhb";
      const uploadPreset = "Ankit_tryon";

      // Upload cloth
      // const clothForm = new FormData();
      // clothForm.append("file", clothFile);
      // clothForm.append("upload_preset", uploadPreset);
      // const clothResponse = await axios.post(
      //   `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      //   clothForm
      // );
      // const clothUrl = clothResponse.data.secure_url;
      // await onUploadCloth(clothUrl);
      

      // Upload person
      const personUrls = [];

      for (const file of personFile) {
        const personForm = new FormData();
        personForm.append("file", file);
        personForm.append("upload_preset", uploadPreset);

        const personResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          personForm
        );

        personUrls.push(personResponse.data.secure_url);
      }

      await onUploadPerson(personUrls);
      console.log("📦 Uploads complete — waiting for auto-trigger...");
      
      
      // console.log("✅ Uploaded cloth URL:", clothUrl);
      console.log("✅ Uploaded person URLs:", personUrls);
    } catch (error) {
      const msg = error.response?.data?.error?.message || error.message;
  console.error("❌ Upload failed:", msg);
  alert("Upload failed: " + msg);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Upload Images for Try-On</h2>

        {/* <label>Upload Cloth Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setClothFile(e.target.files[0])}
        /> */}

        <label>Upload Person Image:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setPersonFile(Array.from(e.target.files))}
        />

        <button onClick={handleUpload}>Upload</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default TryOnPopup;
