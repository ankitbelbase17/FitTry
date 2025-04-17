import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const TryOnContext = createContext(null);

const TryOnContextProvider = (props) => {
  const [tryOnImages, setTryOnImages] = useState([]);
  const [isTryOnActive, setIsTryOnActive] = useState(false);
  // Array of Cloudinary URLs for person images.
  const [userImages, setUserImages] = useState([]);
  // Cloudinary URL for the cloth image.
  const [clothImage, setClothImage] = useState("");

  const toggleTryOn = async () => {
    if (isTryOnActive) {
      setIsTryOnActive(false);
      setTryOnImages([]);
    } else {
      try {
        // Construct the request payload as a JSON object
        const payload = {
          files: userImages, // Array of Cloudinary URLs
          cloth: clothImage, // Cloudinary URL for the cloth image
          num_inference_steps: 50,
          guidance_scale: 2.5,
          seed: 447,
          cloth_type: "upper",
          show_type: "result only",
        };

        // Make a POST request with JSON data to the '/tryonpost' endpoint
        const response = await axios.post(
          "https://fb3e-100-27-189-28.ngrok-free.app/tryonpost",
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        // Update state with received images
        setTryOnImages(response.data.images);
        setIsTryOnActive(true);
      } catch (error) {
        console.error("Error posting try-on images:", error);
      }
    }
  };

  // Handle user image upload: accepts a list of Cloudinary URLs (strings)
  const uploadUserImages = async (cloudinaryUrls) => {
    console.log("Uploaded User Images:", cloudinaryUrls);
    setUserImages(cloudinaryUrls);
  };

  useEffect(() => {
    if (userImages.length === 5 && clothImage) {
      // Ensure both user images and cloth image are available before triggering try-on
      toggleTryOn();
    }
  }, [userImages, clothImage]); // Re-run when either changes

  // Handle cloth image upload: accepts a single Cloudinary URL (string)
  const uploadClothImage = (cloudinaryUrl) => {
    console.log("Uploaded Cloth Image:", cloudinaryUrl);
    setClothImage(cloudinaryUrl);
  };

  const contextValue = {
    tryOnImages,
    isTryOnActive,
    toggleTryOn,
    userImages,
    uploadUserImages,
    clothImage,
    uploadClothImage,
  };

  return (
    <TryOnContext.Provider value={contextValue}>
      {props.children}
    </TryOnContext.Provider>
  );
};

export default TryOnContextProvider;
