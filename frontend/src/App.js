
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Route , Routes } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import LoginSignup from './Pages/LoginSignup';
import Cart from './Pages/Cart';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kid_banner from './Components/Assets/banner_kids.png'
import PrivateRoute from './Components/PrivateRoute';

function App() {
  return (
    <div >

      <BrowserRouter>
      <Navbar/>
      <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginSignup />} />

          {/* Protected Routes - Require Login */}
          <Route path="/" element={<PrivateRoute element={<Shop />} />} />
          <Route path="/mens" element={<PrivateRoute element={<ShopCategory banner={men_banner} category="men" />} />} />
          <Route path="/womens" element={<PrivateRoute element={<ShopCategory banner={women_banner} category="women" />} />} />
          <Route path="/kids" element={<PrivateRoute element={<ShopCategory banner={kid_banner} category="kid" />} />} />
          <Route path="/product/:productId" element={<PrivateRoute element={<Product />} />} />
          <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />

        </Routes>
      <Footer/>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
