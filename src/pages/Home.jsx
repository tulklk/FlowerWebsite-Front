// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Footer from '../components/Footer';
import Services from '../components/homecomponents/Services';
import NewProducts from '../components/homecomponents/NewProducts';
import Navbar from "../components/Navbar.jsx";
// Import hình ảnh banner
import BannerImage1 from '../assets/banner/banner1.jpg';
import BannerImage2 from '../assets/banner/banner2.jpg';
import BannerImage3 from '../assets/banner/banner3.jpg';

// Import hình ảnh cho các phần khác
import FeaturedImage from '../assets/about-img/a1.jpg';
import FlowerLoader from '../components/FlowerLoader'; // Import FlowerLoader

import '../styles/Home.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Testimonials from '../components/homecomponents/Testimonials';
import BlogSlider from '../components/homecomponents/BlogSlider';


function Home() {
  // Cấu hình cho slider
  const settings = {
    dots: false, 
    infinite: true, 
    speed: 500, 
    slidesToShow: 1,
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 2000, 
  };

  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  // Loading trang
  useEffect(() => {
    // Giả lập trạng thái tải dữ liệu
    const timer = setTimeout(() => {
      setLoading(false); // Sau 2 giây, sẽ dừng hiển thị loading
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (  
      <div className="loading-container">
        <div className="spinner"></div>
        {/* <FlowerLoader />  */}
        <p className="loading-text">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="home">
    {/* <Navbar/> */}
      <div className="headerContainer">
        {/* Carousel */}
        <Slider {...settings}>
          <div>
            <img src={BannerImage1} alt="Banner 1" className="bannerImage" />
          </div>
          <div>
            <img src={BannerImage2} alt="Banner 2" className="bannerImage" />
          </div>
          <div>
            <img src={BannerImage3} alt="Banner 3" className="bannerImage" />
          </div>
        </Slider>
      </div>
      {/* Phần dịch vụ */}
      <Services />
      {/* Featured Section */}
      <div className="about-featured">
        <h2>Hoa Nổi Bật & Ưu Đãi</h2>
        <div className="featured-banner">
          <img src={FeaturedImage} alt="Featured Flower" />
          <div className="featured-text">
            <h3>Bộ Sưu Tập Hoa Mùa Xuân</h3>
            <p>
              Khám phá bộ sưu tập hoa Mùa Xuân độc quyền của chúng tôi. Những bông hoa tươi được chọn lọc kỹ càng từ các nhà trồng hoa địa phương tốt nhất.
            </p>
            <a href="/menu">
              <button className='home-button'>Mua ngay</button>
            </a>
          </div>  
        </div>
      </div>
      {/* Blog Section */}

      {/* Phần sản phẩm mới */}
      <NewProducts />
      <BlogSlider />
      <Testimonials />

      <Footer />
    </div>
  );
}

export default Home;