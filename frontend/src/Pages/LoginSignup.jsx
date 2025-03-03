import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import '../Pages/Css/LoginSignup.css';
import {useNavigate} from 'react-router-dom';

const LoginSignup = () => {
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
                localStorage.setItem("token", response.data.token);
                window.dispatchEvent(new Event("storage")); 
                navigate("/");
            } else {
                setIsLogin(true);
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
