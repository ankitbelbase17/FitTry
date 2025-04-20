import './App.css';
import Navbar from './Components/Navbar/Navbar';
import ProfilePage from './Pages/ProfilePage';
import ProfileImagesPage from './Pages/ProfileImagesPage';
import Settings from './Pages/Settings';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import LoginSignup from './Pages/LoginSignup';
import Cart from './Pages/Cart';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kid_banner from './Components/Assets/banner_kids.png';
import { useState, useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkToken();
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true); // Called on successful login
  };

  return (
    <div>
      <BrowserRouter>
        {isAuthenticated && <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} /> }
        

        <Routes>
          {/* Public route */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" /> : <LoginSignup onLogin={handleLogin} />
          } />

          {/* Protected routes */}
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Shop />} />
              <Route path="/mens" element={<ShopCategory banner={men_banner} category="men" />} />
              <Route path="/womens" element={<ShopCategory banner={women_banner} category="women" />} />
              <Route path="/kids" element={<ShopCategory banner={kid_banner} category="kid" />} />
              <Route path="/product/:productId" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/images" element={<ProfileImagesPage />} />
              <Route path="/settings" element={<Settings />} />
            </>
          ) : (
            <>
              {/* Redirect all protected paths to login */}
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>

        {isAuthenticated && <Footer />}
      </BrowserRouter>
    </div>
  );
}

export default App;
