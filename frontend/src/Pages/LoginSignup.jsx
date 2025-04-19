import React, { useState } from 'react';
import axios from 'axios';
import '../Pages/Css/LoginSignup.css';
import { useNavigate } from 'react-router-dom';

const LoginSignup = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);  // Toggle between login/signup
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/signup";
    
    try {
      const response = await axios.post(endpoint, formData);
      if (isLogin) {
        // Store the JWT token in localStorage
        localStorage.setItem("token", response.data.token);
        
        // Notify parent component about successful login
        onLogin();

        // Redirect to home page after login
        navigate("/");
      } else {
        setIsLogin(true);  // Switch to login form after successful signup
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        <form className="loginsignup-fields" onSubmit={handleSubmit}>
          {!isLogin && <input type="text" name="name" placeholder="Name" onChange={handleChange} />}
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Continue</button>
        </form>
        <p className="loginsignup-login">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer", color: "blue" }}>
            {isLogin ? " Sign up here" : " Login here"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
