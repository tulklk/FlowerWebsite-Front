import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop"; 
import Testimonials from "./components/homecomponents/Testimonials"; // Import Testimonials component

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from './pages/SignUp';
import ProfilePage from './pages/ProfilePage';
import SellerDashboard from './pages/SellerDashboard.jsx';
import Cart from './pages/Cart';
import AdminUserManagement from './pages/AdminUserManagement';
import FlowerBatchDetail from "./pages/FlowerBatchDetail";
import BlogPage from "./pages/Blog";
import Checkout from './pages/Checkout';
import SuccessPage from './pages/SuccessPage';
import ForgotPassword from './pages/ForgotPassword';
import ReviewPage from "./pages/ReviewPage.jsx";

function App() {
  // State quản lý giỏ hàng toàn cục
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCartItems);
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const [testimonials, setTestimonials] = useState([]);  // Only use testimonials if needed

  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        {/* Navbar sẽ luôn hiển thị */}
        <Navbar cartCount={cartItems.length} /> 
        
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/flower/:id" element={<FlowerBatchDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact setTestimonials={setTestimonials} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile-page" element={<ProfilePage />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/admin-user-management" element={<AdminUserManagement />} />
          <Route path="/blog-page" element={<BlogPage />} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/success-page" element={<SuccessPage />} />
          <Route path="/review/:orderID" element={<ReviewPage />} />
        </Routes>

        {/* Add Testimonials here */}
        {/* <Testimonials setTestimonials={setTestimonials} />  Pass setTestimonials if you want to update the state */}
      </Router>
    </div>
  );
}

export default App;
