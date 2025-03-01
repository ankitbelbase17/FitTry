import React from 'react'
import '../DescriptionBox/DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">
          Description
        </div>
        <div className="descriptionbox-nav-box fade">
          Reviews (100)
        </div>
      </div>

      <div className="descriptionbox-description">
        <p>An e-commerce platform enables online buying and selling of goods/services, offering features like product listings, secure payments, inventory management, and customer support for a seamless shopping experience.</p>
        <p>e-commerce platform enables online buying and selling of goods/services, offering features like product listings, secure payments, inventory management, customer support, and personalized recommendations for a seamless shopping experience.</p>
      </div>

    </div>
  )
}

export default DescriptionBox