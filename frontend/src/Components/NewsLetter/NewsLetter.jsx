import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='newsletter'>
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subscribe to our DEEPFIT and stay updated</p>
      <div>
        <input type="email" placeholder="ankitbelbase1@.com"/>
        <button>Subscribe</button>
      </div>
    </div>
  )
}

export default NewsLetter