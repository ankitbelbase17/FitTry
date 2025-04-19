import React, { useContext , useEffect} from 'react'
import { ShopContext } from '../Context/ShopContext'
import {useParams} from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import { TryOnContext } from '../Context/TryOnContextProvider';


const Product = () => {
  const {all_product} = useContext(ShopContext);
  const { resetTryOn } = useContext(TryOnContext);
  const {productId} = useParams();
  const product = all_product.find((e)=>e.id === Number(productId));

  useEffect(() => {
    resetTryOn(); // ✅ Reset try-on state on product change
  }, [productId]);
  

  return (
    <div>
      <Breadcrum product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox/>
      <RelatedProducts/>
       
    </div>
  )
}

export default Product