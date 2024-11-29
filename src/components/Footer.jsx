import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import visa from "../assets/payment-img/visa.png";
import master from "../assets/payment-img/master.png";
import vnpay from "../assets/payment-img/vnpay.png";
import momo from "../assets/payment-img/momo.png";
import "../styles/Footer.css";
import { color } from "chart.js/helpers";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>Event Flower Exchange Website</h2>
          <p>
            Khách hàng có thể liên hệ với chúng tôi qua các kênh dưới đây. Cảm ơn bạn và
            chúng tôi rất vinh dự khi có bạn là khách hàng của chúng tôi.
          </p>
          <div className="socialMedia">
            <TwitterIcon /> <FacebookIcon /> <LinkedInIcon /> <InstagramIcon />
          </div>
        </div>

        <div className="footer-section">
          <h3>HỖ TRỢ</h3>
          <ul>
            <li>Sản phẩm</li>
            <li>Trợ giúp & Hỗ trợ</li>
            <li>Chính sách hoàn trả</li>
            <li>Điều khoản sử dụng</li>
            <li>Câu hỏi thường gặp</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>PHƯƠNG THỨC THANH TOÁN</h3>
          <img src= {visa}alt="Visa" />
          <img src={master} alt="MasterCard" />
          <img src={vnpay} alt="VNPAYs" />
          <img src={momo}alt="Momo" />
        </div>

        <div className="footer-section contact-us">
          <h3>LIÊN HỆ VỚI CHÚNG TÔI</h3>
          <p>TP. Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam</p>
          <p>Điện thoại: +865 20 96863648</p>
          <p>Email: flowerparadise@gmail.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p> &copy; 2024 flower-event-exchange-website.com</p>
      </div>
    </div>
  );
}

export default Footer;
