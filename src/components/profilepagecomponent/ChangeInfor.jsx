import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChangeInfor.css'; 

const ChangeInfoPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    address: '',
    phoneNumber: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false); 
  const [popupMessage, setPopupMessage] = useState(''); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setFormData({
        username: parsedUser.username,
        address: parsedUser.address,
        phoneNumber: parsedUser.phoneNumber
      });
    } else {
      setErrorMessage('User data not found');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userID = JSON.parse(localStorage.getItem('user')).userID;
    
    if (userID) {
      axios.put(`http://localhost:8080/identity/users/${userID}`, formData)
        .then(response => {
          setPopupMessage("Cập nhật thông tin thành công!");
          setShowPopup(true); 

          // Update localStorage with new user information
          const updatedUser = {
            ...JSON.parse(localStorage.getItem('user')),
            username: formData.username,
            address: formData.address,
            phoneNumber: formData.phoneNumber,
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));

          setErrorMessage('');
        })
        .catch(error => {
          setErrorMessage(error.response?.data?.message || 'Failed to update user');
        });
    } else {
      setErrorMessage('User ID is missing');
    }
  };

  return (
    <div className="change-info-container">
      <h2>Thay đổi thông tin</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="change-info-form">
        <div>
          <label>Tên người dùng: </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mật khẩu: </label>
          <input
            type="password" // Change to password input type for security
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Địa chỉ: </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Số điện thoại: </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Cập nhật</button>
      </form>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-icon">✅</div>
            <h2>Thông báo</h2>
            <p className="popup-message">{popupMessage}</p>
            <button
              className="close-button-popup"
              onClick={() => setShowPopup(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeInfoPage;
