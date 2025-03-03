import React ,{useContext, useState, useEffect} from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import { jwtDecode } from "jwt-decode";


const Navbar = () => {
  const [menu , setMenu] = useState("shop");
  const {getTotalCartItems} = useContext(ShopContext);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsLoggedIn(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt=""/>
        <p>DEEPFIT</p>

      </div>
      <ul className="nav-menu">
        <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration: 'none' , color: 'inherit'}}   to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>} </li>
        <li onClick={()=>{setMenu("mens")}}><Link style={{textDecoration: 'none' , color: 'inherit'}}  to='/mens'>Men</Link>{menu==="mens"?<hr/>:<></>} </li>
        <li onClick={()=>{setMenu("womens")}}><Link style={{textDecoration: 'none' , color: 'inherit'}}   to='/womens'>Women</Link>{menu==="womens"?<hr/>:<></>} </li>
        <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration: 'none' , color: 'inherit'}}  to='/kids'>Kids</Link>{menu==="kids"?<hr/>:<></>} </li>
      </ul>
      <div className="nav-login-cart">
      {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button> // Show Logout button
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}      
        <Link to='/cart'><img src={cart_icon} alt=""/></Link>
        <div className="nav-cart-count">
          {getTotalCartItems()}
        </div>

      </div>
      
        

      
      </div>
  )
}

export default Navbar