import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/axios';
import '../styles/Login.css';
import Footer from '../components/Footer';
import ReCAPTCHA from "react-google-recaptcha";
import Navbar from "../components/Navbar.jsx";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);

  const onChange = (value) => {
    setVerified(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const decodeToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!verified) {
      setCaptchaError('Bạn phải xác thực trước khi đăng nhập');
      return;
    }

    setCaptchaError('');
    const loginValues = { email, password };

    try {
      const response = await api.post("http://localhost:8080/identity/auth/token", loginValues);

      if (response.data && response.data.result) {
        const { token, isBlocked, status } = response.data.result;

        if (isBlocked || status === 'blocked') {
          setError("Tài khoản đã bị khóa");
          return;
        }

        if (!token) {
          console.error("Token not found in response");
          return;
        }

        localStorage.setItem("token", token);
        const decodedPayload = decodeToken(token);

        const user = {
          address: decodedPayload.address,
          email: decodedPayload.email,
          exp: decodedPayload.exp,
          iat: decodedPayload.iat,
          iss: decodedPayload.iss,
          phoneNumber: decodedPayload.phoneNumber,
          roles: decodedPayload.roles,
          scope: decodedPayload.scope,
          sub: decodedPayload.sub,
          userID: decodedPayload.userID,
          username: decodedPayload.username,
        };

        localStorage.setItem("user", JSON.stringify(user));

        const { roles } = decodedPayload;
        if (roles.includes('ADMIN')) {
          navigate('/admin-user-management');
        } else if (roles.includes('BUYER')) {
          navigate('/');
        } else {
          setError("Tài khoản hoặc mật khẩu sai");
        }
        window.location.reload();
      } else {
        setError("Tài khoản hoặc mật khẩu sai");
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.isBlocked) {
        setError("Tài khoản đã bị khóa");
      } else {
        setError("Tài khoản hoặc mật khẩu sai . Vui lòng thử lại !");
      }
      console.error("Login error:", error.response ? error.response.data : error.message);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential; 

    try {
    
      const response = await api.post("http://localhost:8080/identity/auth/google/login", { token });

      if (response.data && response.data.result) {
        const { token: userToken, isBlocked, status } = response.data.result;

  
        if (isBlocked || status === 'blocked') {
          setError("Tài khoản đã bị khóa");
          return;
        }

 
        if (!userToken) {
          console.error("Token not found in response");
          return;
        }


        localStorage.setItem("token", userToken);
        const decodedPayload = decodeToken(userToken); 


        const user = {
          address: decodedPayload.address,
          email: decodedPayload.email,
          exp: decodedPayload.exp,
          iat: decodedPayload.iat,
          iss: decodedPayload.iss,
          phoneNumber: decodedPayload.phoneNumber,
          roles: decodedPayload.roles,
          scope: decodedPayload.scope,
          sub: decodedPayload.sub,
          userID: decodedPayload.userID,
          username: decodedPayload.username,
        };

        localStorage.setItem("user", JSON.stringify(user));

        const { roles } = decodedPayload;
        if (roles.includes('ADMIN')) {
          navigate('/admin-user-management');
        } else if (roles.includes('BUYER')) {
          navigate('/');
        } else {
          setError("Tài khoản hoặc mật khẩu sai");
        }

        window.location.reload(); 

      } else {
        setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.isBlocked) {
        setError("Tài khoản đã bị khóa");
      } else {
        setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
      }
      console.error("Error during Google login:", error);
    }
  };


  const handleGoogleLoginFailure = () => {
    setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <GoogleOAuthProvider clientId="23148986973-0btj17vsb3gflkboj6h73pbs3ejjnhq6.apps.googleusercontent.com">
      <div className="login-container">
        <Navbar />
        <div className="login-card">
          <h2>Đăng nhập</h2>
          <form onSubmit={handleLogin}>
            <div className="form-field">
              <input
                className="form-input"
                placeholder=" "
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email" className="form-label">Email</label>
            </div>

            <div className="form-field password-field">
              <input
                className="form-input"
                placeholder=" "
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password" className="form-label">Mật khẩu</label>
              <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="forgot-password-button">
              <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>

            <ReCAPTCHA
              className="recaptcha-container"
              sitekey="6Lc6HXMqAAAAAM9XrwtWGbUzz_Duzhg3vQGct6gz"
              onChange={onChange}
            />

            {captchaError && <div className="error-message" style={{ color: "red", marginTop: "5px" }}>{captchaError}</div>}
            {error && <div className="error-message" style={{ color: "red", marginTop: "5px" }}>{error}</div>}

            <button type="submit" className="login-btn">
              Đăng Nhập
            </button>
          </form>
          
          <div className="google-login-container">
            <p className="alternate-login-text"><strong>Hoặc đăng kí bằng</strong></p>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
            />
          </div>

          <div className="signup-link">
            Bạn chưa có tài khoản? <Link to="/signup">Đăng kí tại đây</Link>
          </div>
        </div>
        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
