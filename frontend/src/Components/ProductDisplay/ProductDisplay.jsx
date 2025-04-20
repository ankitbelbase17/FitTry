import React, { useContext, useState } from "react";
import "../ProductDisplay/ProductDisplay.css";
import { ShopContext } from "../../Context/ShopContext";
import { TryOnContext } from "../../Context/TryOnContextProvider";
import TryOnPopup from "../TryOnPopup/TryOnPopup";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import axios from "axios";

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const {
    tryOnImages,
    isTryOnActive,
    uploadUserImages,
    toggleTryOn,
  } = useContext(TryOnContext);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Handler for default try-on using saved profile images
  const handleTryOnDefault = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/user/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const defaultImages = response.data.profileImages;
      if (!defaultImages || defaultImages.length === 0) {
        alert("No default images found. Please upload images first.");
        return;
      }

      // Set user images in context
      uploadUserImages(defaultImages);
      // Activate try-on display
      toggleTryOn();
    } catch (err) {
      console.error("Default try-on failed:", err);
      alert("Unable to perform default try-on. Please try again later.");
    }
  };

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img">
          {isTryOnActive && tryOnImages.length > 0 ? (
            <img
              className="productdisplay-main-img"
              src={tryOnImages[selectedImageIndex]}
              alt={`try-on-${selectedImageIndex}`}
            />
          ) : (
            <img
              className="productdisplay-main-img"
              src={product.image}
              alt="Default"
            />
          )}
        </div>

        <div className="productdisplay-img-list">
          {isTryOnActive ? (
            tryOnImages.length > 0 ? (
              tryOnImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`try-on-${index}`}
                  onClick={() => setSelectedImageIndex(index)}
                  style={{
                    cursor: "pointer",
                    border:
                      selectedImageIndex === index
                        ? "2px solid black"
                        : "1px solid gray",
                    borderRadius: "4px",
                    margin: "4px",
                    width: "80px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              ))
            ) : (
              <p>Loading...</p>
            )
          ) : (
            <>  
              <img src={product.image} alt="" />
              <img src={product.image} alt="" />
              <img src={product.image} alt="" />
              <img src={product.image} alt="" />
            </>
          )}
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_dull_icon} alt="star" />
          <p>(100)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            Rs {product.old_price}
          </div>
          <div className="productdisplay-right-price-new">
            Rs {product.new_price}
          </div>
        </div>
        <div className="productdisplay-right-description">
          Stylish and comfortable clothing for every occasion, crafted
          with premium fabrics to ensure a perfect blend of fashion and
          functionality.
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            <div>S</div>
            <div>M</div>
            <div>L</div>
            <div>XL</div>
            <div>XXL</div>
          </div>
        </div>

        {/* Buttons: Add to Cart, Try On (upload flow), Try On Default (preset flow) */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "40px" }}>
          <button onClick={() => addToCart(product.id)}>ADD TO CART</button>

          {/* Open upload popup for custom try-on */}
          <button onClick={() => setShowPopup(true)} className="tryon-button">
            TRY ON
          </button>

          {/* Fetch & use default profile images for try-on */}
          <button onClick={handleTryOnDefault} className="tryon-button">
            TRY ON DEFAULT
          </button>
        </div>

        {showPopup && (
          <TryOnPopup
            onClose={() => setShowPopup(false)}
            onUploadPerson={uploadUserImages}
          />
        )}

        <p className="productdisplay-right-category">
          <span>Category : </span>Women, T-Shirt, Crop Top
        </p>
        <p className="productdisplay-right-category">
          <span>Tags : </span>Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
