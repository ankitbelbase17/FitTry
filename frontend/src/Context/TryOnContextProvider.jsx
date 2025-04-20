import React, { createContext, useState, useEffect , useRef } from "react";
import axios from "axios";

export const TryOnContext = createContext(null);



const TryOnContextProvider = (props) => {
  const [tryOnImages, setTryOnImages] = useState([]);
  const [isTryOnActive, setIsTryOnActive] = useState(false);
  const [userImages, setUserImages] = useState([]); // array of 5 Cloudinary URLs
  const [clothImage, setClothImage] = useState("");
  const triggerLockRef = useRef(false);
   // single Cloudinary URL
  // const resetTryOn = () => {
  //   setIsTryOnActive(false);
  //   setTryOnImages([]);
  // };
  const resetTryOn = () => {
    setTryOnImages([]);
    setUserImages([]);
    setClothImage(null);
    setIsTryOnActive(false);
  };
  
  
  const toggleTryOn = async () => {
    if (triggerLockRef.current) {
      console.warn("Already generating. Skipping duplicate call.");
      return;
    }
  
    if (isTryOnActive) {
      setIsTryOnActive(false);
      setTryOnImages([]);
      return;
    }
  
    if (userImages.length < 1 || !clothImage) {
      console.warn("Need at least 1 user image and a cloth image.");
      return;
    }
  
    triggerLockRef.current = true; // Lock
  
    try {
      console.log("Sending to server:", {
        person_urls: userImages,
        cloth_url: clothImage,
      });
  
      const response = await axios.post(
        "https://61ef-34-46-82-1.ngrok-free.app/generate",
        {
          person_urls: userImages,
          cloth_url: clothImage,
          num_inference_steps: 50,
          guidance_scale: 2.5,
          seed: 447,
          cloth_type: "upper",
        },
        { headers: { "Content-Type": "application/json" } }
      );
  
      const resultUrls = response.data.urls;
      console.log("Received Try-On Results:", resultUrls);
  
      setTryOnImages(resultUrls);
      setIsTryOnActive(true);
    } catch (error) {
      console.error("Error generating try-on results:", error);
    } finally {
      triggerLockRef.current = false; // Release lock
    }
  };
  
  // rest of your context remains the same
  const uploadUserImages = async (cloudinaryUrls) => {
    setUserImages(cloudinaryUrls);
  };

  const uploadClothImage = (cloudinaryUrl) => {
    setClothImage(cloudinaryUrl);
  };

  // optional: auto-trigger once you have 5 + cloth
  useEffect(() => {
    console.log("useEffect fired");
    console.log("userImages.length:", userImages.length);
    console.log("clothImage:", clothImage);
    console.log("isTryOnActive:", isTryOnActive);
    console.log("triggerLockRef.current:", triggerLockRef.current);
  
    if (
      userImages.length >= 1 &&
      clothImage &&
      !isTryOnActive &&
      !triggerLockRef.current
    ) {
      console.log("Triggering TryOn from useEffect...");
      toggleTryOn();
    }
  }, [userImages, clothImage, isTryOnActive]);
  
  

  return (
    <TryOnContext.Provider
      value={{
        tryOnImages,
        isTryOnActive,
        toggleTryOn,
        userImages,
        uploadUserImages,
        clothImage,
        uploadClothImage,
        resetTryOn,
      }}
    >
      {props.children}
    </TryOnContext.Provider>
  );
};

export default TryOnContextProvider;
