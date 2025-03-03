import React, { createContext, useState } from "react";
import axios from "axios";

export const TryOnContext = createContext(null);

const TryOnContextProvider = (props) => {
  const [tryOnImages, setTryOnImages] = useState([]);
  const [isTryOnActive, setIsTryOnActive] = useState(false);

  // Function to fetch try-on images or toggle off
  const toggleTryOn = async () => {
    if (isTryOnActive) {
      setIsTryOnActive(false);
      setTryOnImages([]);
    } else {
      try {
        // The server returns a JSON object with an "images" property that is an array of base64 strings.
        const response = await axios.get("https://edfa-35-197-69-32.ngrok-free.app/tryon", {
          responseType: "json",
        });

        // Assuming the response structure is: { images: [base64Image1, base64Image2, ...] }
        const base64Images = response.data.images;
        setTryOnImages(base64Images);
        setIsTryOnActive(true);
      } catch (error) {
        console.error("Error fetching try-on images:", error);
      }
    }
  };

  const contextValue = {
    tryOnImages,
    isTryOnActive,
    toggleTryOn,
  };

  return (
    <TryOnContext.Provider value={contextValue}>
      {props.children}
    </TryOnContext.Provider>
  );
};

export default TryOnContextProvider;
