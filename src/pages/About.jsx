import React, { useState, useEffect } from "react";
import { FaSeedling, FaStore, FaHandHoldingHeart, FaLeaf, FaBullseye } from "react-icons/fa";
import "../styles/About.css";
import hoaback from "../assets/hoaback3.png";
import Footer from "../components/Footer";
import Introduction from '../components/aboutcomponents/Introduction';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import missionImage from "../assets/hoaback3.png";
import visionImage from "../assets/hoaback3.png";
// import Navbar from "../components/Navbar.jsx";

const About = () => {
  const [loading, setLoading] = useState(true);
//Hiệu ứng loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Đang tải dữ liệu...</p>
      </div>
    );
  }
  return (
    <div className="about">
      {/* <Navbar/> */}

      <div className="about-banner">
        <img
          src={hoaback}
          alt="Beautiful Flower Banner"
          className="banner-image"
        />
        <div className="banner-text">
          <h1>Flower Exchange Website</h1>
          <p>Nơi trao đổi mua sắm hoa tươi đẹp, độc đáo và chất lượng dành cho bạn.</p>
        </div>
      </div>
     
      <Introduction />
 
      <div className="about-section">
        <div className="about-card">
          <FaStore className="about-icon" />
          <h2>Website của chúng tôi</h2>
          <p>
            Flower Exchange Website là một nền tảng đáng tin cậy để người bán đăng bán
            nhiều loại hoa, từ hoa hồng đến các lẵng hoa kỳ lạ. Sứ mệnh của chúng tôi là kết nối những người yêu hoa với các nhà hoa tài năng,
            những người tạo ra những lẵng hoa đẹp nhất.
          </p>
        </div>

        <div className="about-card">
          <FaSeedling className="about-icon" />
          <h2>Cho Người Bán</h2>
          <p>
            Trở thành người bán và thể hiện sự sáng tạo nghệ thuật của bạn! Đăng sản phẩm của bạn với những hình ảnh đẹp,
            mô tả chi tiết và giá cả. Tiếp cận khách hàng trên toàn quốc và phát triển doanh nghiệp hoa của bạn dễ dàng.
          </p>
        </div>

        <div className="about-card">
          <FaHandHoldingHeart className="about-icon" />
          <h2>Cho Khách Hàng</h2>
          <p>
            Cho dù bạn đang tìm kiếm một bó hoa đơn giản hay một lẵng hoa tùy chỉnh lớn,
            bạn sẽ tìm thấy những bông hoa hoàn hảo cho bất kỳ dịp nào. Hỗ trợ các doanh nghiệp địa phương bằng cách mua từ những người bán gần bạn, hoặc khám phá những loài hoa kỳ lạ từ khắp nơi trên thế giới.
          </p>
        </div>
      </div>

      <div className="mission-vision">
        <h2>Sứ Mệnh và Tầm Nhìn</h2>
        <div className="mission">
          <img src={missionImage} alt="Mission" className="mission-image" />
          <div className="mission-content">
            <FaBullseye className="mission-icon" />
            <p>
              Sứ mệnh của chúng tôi là cung cấp nền tảng uy tín cho các nhà bán hoa
              và những người yêu hoa kết nối với nhau, xây dựng cộng đồng yêu hoa mạnh mẽ.
              Chúng tôi mong muốn trở thành thị trường hoa trực tuyến đáng tin cậy nhất.
            </p>
          </div>
        </div>

        <div className="vision">
          <img src={visionImage} alt="Vision" className="vision-image" />
          <div className="vision-content">
            <FaSeedling className="vision-icon" />
            <p>
              Tầm nhìn của chúng tôi là truyền cảm hứng cho tình yêu và sự tôn trọng dành
              cho hoa qua nền tảng dễ sử dụng, đa dạng các loại hoa và luôn luôn đặt chất lượng lên hàng đầu.
            </p>
          </div>
        </div>
      </div>

      <div className="map-section">
        <h2>Tìm chúng tôi</h2>
        <div className="map-container">
          <iframe
            title="Địa chỉ của tôi trên Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6099415310923!2d106.80730271068495!3d10.841132857952116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1730317777392!5m2!1svi!2s"
            width="100%"
            height="500"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
