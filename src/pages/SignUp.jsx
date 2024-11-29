import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for visibility toggle
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import api from '../config/axios';
import { useNavigate } from 'react-router-dom';
import '../styles/popup.css'; // Đảm bảo đường dẫn chính xác đến file CSS
import '../styles/SignUp.css';

const SignUp = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle for Password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for Confirm Password visibility
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const [showPopup, setShowPopup] = useState(false); // Điều khiển hiển thị pop-up
  const [popupMessage, setPopupMessage] = useState(''); // Thông điệp hiển thị trong pop-up

  const navigate = useNavigate();

  useEffect(() => {
    // Giả lập trạng thái tải dữ liệu
    const timer = setTimeout(() => {
      setLoading(false); // Sau 2 giây, sẽ dừng hiển thị loading
    }, 2000); // Bạn có thể thay đổi thời gian này theo yêu cầu

    // Cleanup timer nếu component bị unmount
    return () => clearTimeout(timer);
  }, []);
  
  //
  if (loading) {
    return (
      <div className="loading-container">
  <div className="spinner"></div>
  <p className="loading-text">Đang tải dữ liệu...</p>
</div>

    );
  }





  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu không giống nhau !');
      return;
    } else {
      setErrorMessage('');
    }
  
    setLoading(true); // Start loading
  
    try {
      // API request to send signup data to the server
      await api.post('http://localhost:8080/identity/users/create', {
        username,
        email,
        password,
        phoneNumber,
      });
  
      // Show success message and popup
      setPopupMessage("Bạn đã tạo tài khoản thành công! Vui lòng vào email để xác thực tài khoản ");
      setShowPopup(true); // Display the popup
    } catch (error) {
      // Handle error response
      setErrorMessage(
        error.response?.data?.message || 'Tạo tài khoản không thành công . Vui lòng thử lại .'
      );
      console.error('Signup error:', error);
    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the password visibility
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword); // Toggle the confirm password visibility
  };

  return (
    <div className="page-container-sign-up">
      <div className="content-wrap">
        <div className="signup-container">
          <div className="signup-form">
            <h2>Tạo tài khoản</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Họ và tên </label>
                <div className="input-container">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Nhập tên của bạn"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Email</label>
                <div className="input-container">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Mật khẩu</label>
                <div className="input-container">
                  <input
                    type={showPassword ? 'text' : 'password'} // Toggle between text and password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu của bạn"
                    required
                  />
                  {/* Toggle password visibility */}
                  <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="input-group">
                <label>Xác nhận mật khẩu </label>
                <div className="input-container">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'} // Toggle between text and password for confirm password
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận lại mật khẩu"
                    required
                  />
                  {/* Toggle confirm password visibility */}
                  <span className="password-toggle-icon" onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="input-group">
                <label>Số điện thoại</label>
                <div className="input-container">
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Nhập SĐT của bạn "
                    required
                  />
                </div>
              </div>

              {errorMessage && <p className="error-message">{errorMessage}</p>}
              {successMessage && <p className="success-message">{successMessage}</p>}

              <button type="submit" className="signup-btn">
                Đăng ký
              </button>
            </form>
            <div className="already-account">
              <p>Bạn đã có tài khoản ? <Link to="/login">Đăng nhập</Link></p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {/* Hiển thị pop-up nếu đăng ký thành công */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-icon">✅</div>
            <h2>Thông báo</h2>
            <p className="popup-message">{popupMessage}</p>
            <button
              className="close-button-popup"
              onClick={() => {
                setShowPopup(false); // Close the popup
                navigate('/login');
              }}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
