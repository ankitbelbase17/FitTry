import React, { useContext, useState , useEffect } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import ProfileDropdown from './ProfileDropdown';
import axios from 'axios';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [menu, setMenu] = useState("shop");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getTotalCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get('http://localhost:5000/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserData(response.data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false); // Update auth state in App.js
    navigate("/login");
  };

  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt="logo" />
        <p>DEEPFIT</p>
      </div>

      <ul className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/'>Shop</Link>
          {menu === "shop" && <hr />}
        </li>
        <li onClick={() => setMenu("mens")}>
          <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/mens'>Men</Link>
          {menu === "mens" && <hr />}
        </li>
        <li onClick={() => setMenu("womens")}>
          <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/womens'>Women</Link>
          {menu === "womens" && <hr />}
        </li>
        <li onClick={() => setMenu("kids")}>
          <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/kids'>Kids</Link>
          {menu === "kids" && <hr />}
        </li>
      </ul>

      <div className="nav-login-cart">
  {isAuthenticated ? (
    !loading && userData ? (
      <ProfileDropdown 
        user={userData} 
        onLogout={handleLogout} 
      />
    ) : (
      <button onClick={handleLogout}>Logout</button>
    )
  ) : (
    <Link to="/login">
      <button>Login</button>
    </Link>
  )}
        <Link to='/cart'><img src={cart_icon} alt="cart" /></Link>
        <div className="nav-cart-count">
          {getTotalCartItems()}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
