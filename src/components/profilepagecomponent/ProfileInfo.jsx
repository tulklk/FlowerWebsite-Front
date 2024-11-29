import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import './ProfileInfo.css';
import { useNavigate } from 'react-router-dom';

const ProfileInfo = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="profile-info-component">
      <h2>Thông tin của bạn</h2>
        <label>
          <strong>Họ và Tên</strong>
          <input className='name'
            type="text"
            name="username"
            value={user.username}
            readOnly
          />
        </label>

        <label>
          <strong>Email</strong>
          <input className='mail'
            type="email"
            name="email"
            value={user.email}
            readOnly
          />
        </label>

        <label>
          <strong>Số điện thoại</strong>
          <input className='phone'
            type="text"
            name="phoneNumber"
            value={user.phoneNumber}
            readOnly
            
          />
        </label>

        <label>
          <strong>Địa chỉ</strong>
          <input className='address'
            type="text"
            name="address"
            value={user.address}
            readOnly
          />
        </label>
        
        {/* <label>
          vai trò:
          <input className='roles'
            type="text"
            name="roles"
            value={user.roles}
            readOnly
          />
        </label> */}
        
      
    </div>
  );
};

export default ProfileInfo;
