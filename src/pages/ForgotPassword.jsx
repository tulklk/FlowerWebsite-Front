import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../styles/ForgotPassword.css";
import Footer from '../components/Footer';
import Navbar from "../components/Navbar.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/identity/users/forgot-password?email=${email}`);
      setPopupMessage("Đã gửi yêu cầu khôi phục mật khẩu! Vui lòng kiểm tra email.");
      setShowPopup(true);
    } catch (error) {
      setMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="page-container">
    <Navbar/>
      <div className="content-wrapper forgot-password">
        <form onSubmit={handleForgotPassword}>
        <h2>Quên mật khẩu</h2>
          <label><strong>Email của bạn</strong></label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Lấy lại mật khẩu</button>
        </form>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-container">
              <div className="popup-icon">✅</div>
              <h2>Thông báo</h2>
              <p className="popup-message">{popupMessage}</p>
              <button
                className="close-button-popup"
                onClick={() => {
                  setShowPopup(false);
                  navigate('/login');
                }}>
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
