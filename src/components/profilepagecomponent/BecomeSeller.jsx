import React, { useState } from 'react';
import axios from "axios";
import './BecomeSeller.css'
const BecomeSeller = ({ setError }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleBecomeSeller = async () => {
    try {
      // Retrieve the user from localStorage and extract userID
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || !user.userID) {
        setError('Không thể tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
        return;
      }

      const userID = user.userID;

      // Send notification to admin about the seller request
      const notificationData = {
        content: "UserID: "+user.userID+" muốn thành seller",
        notificationType: "setSeller",
        user: {
          userID: 1
        }
      };

      const response = await axios.post(`http://localhost:8080/identity/noti/`, notificationData);

      if (response.status === 201) {
        // Display popup message upon successful request
        setPopupMessage("Yêu cầu trở thành người bán hàng của bạn đã được gửi đến quản trị viên!");
        setShowPopup(true); // Show the popup
      }
    } catch (error) {
      console.error('Error sending seller request notification:', error);
      setError('Có lỗi xảy ra khi gửi yêu cầu trở thành người bán hàng.');
    }
  };

  return (
    <div className="become-seller-container">
      <h2>Bạn có muốn trở thành người bán hàng không?</h2>
      <p>Khi xác nhận, yêu cầu của bạn sẽ được gửi đến quản trị viên.</p>
      <button className="confirm-seller-button" onClick={handleBecomeSeller}>
        Xác nhận
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-icon">✅</div>
            <h2>Thông báo</h2>
            <p className="popup-message">{popupMessage}</p>
            <button
              className="close-button-popup"
              onClick={() => setShowPopup(false)} // Close the popup
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BecomeSeller;
