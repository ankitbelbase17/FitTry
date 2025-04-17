import React, { useContext } from 'react';
import './Css/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import { TryOnContext } from '../Context/TryOnContextProvider';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Items from '../Components/Items/Items';
import axios from "axios";

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const { uploadClothImage } = useContext(TryOnContext);

  // When an item is clicked, update the clothImage state in TryOnContext.
  const handleItemClick = async (item) => {
    try {
      // Fetch the image as a Blob
      const response = await fetch(item.image);
      const blob = await response.blob();
  
      // Convert Blob to a File object
      const file = new File([blob], "upload.png", { type: blob.type });
  
      // Prepare FormData for Cloudinary upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Ankit_tryon"); // Replace with your Cloudinary upload preset
      formData.append("cloud_name", "dov3gyfcz"); // Replace with your Cloudinary cloud name
  
      // Upload the file to Cloudinary
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dov3gyfcz/image/upload",
        formData
      );
  
      // If upload is successful, pass the Cloudinary URL to uploadClothImage
      if (cloudinaryResponse.data.secure_url) {
        console.log(cloudinaryResponse.data.secure_url);
        uploadClothImage(cloudinaryResponse.data.secure_url);
      } else {
        console.error("Cloudinary upload failed:", cloudinaryResponse.data);
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    }
  };
  
  return (
    <div className="shop-category"> 
      <img className="shopcategory-banner" src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-12</span> out of 36 Products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>

      <div className="shopcategory-products">
        {all_product.map((item, i) => {
          if (props.category === item.category) {
            return (
              <div key={i} onClick={() => handleItemClick(item)}>
                <Items
                  id={item.id}
                  name={item.name}
                  image={item.image}
                  new_price={item.new_price}
                  old_price={item.old_price}
                />
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>

      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  );
};

export default ShopCategory;
