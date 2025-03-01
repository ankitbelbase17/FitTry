import React from 'react'
import '../Pages/Css/LoginSignup.css'

const LoginSignup = () => {
  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Sign Up</h1>
        <div className="loginsignup-fields">
          <input type="text " placeholder='Name' />
          <input type="email " placeholder='ankit@gmail.com' />
          <input type="password" placeholder='******' />
        </div>
        <button>Continue</button>
        <p className="loginsignup-login">Already have an account ? <span>Login here</span></p>
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' />
          <p>By continuing , i agree to use terms of use and privacy policy</p>
        </div>
        
      </div>
    </div>
  )
}

export default LoginSignup;