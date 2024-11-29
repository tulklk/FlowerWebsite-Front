import React, { useState, useEffect } from "react";
import ProfileInfo from '../components/profilepagecomponent/ProfileInfo.jsx';
import ChangeInfor from "../components/profilepagecomponent/ChangeInfor.jsx";
import OrderHistory from "../components/profilepagecomponent/OrderHistory.jsx";
import BecomeSeller from "../components/profilepagecomponent/BecomeSeller.jsx";
import "../styles/ProfilePage.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const ProfilePage = () => {
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null);
  const [role, setRole] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = () => {
      const fetchedUser = JSON.parse(localStorage.getItem('user'));

      if (fetchedUser && fetchedUser.userID) {
        setUserID(fetchedUser.userID);
        setRole(fetchedUser.role); 
      }
    };

    fetchUserRole();

    const handleStorageChange = () => {
      fetchUserRole();
    };

    window.addEventListener('storage', handleStorageChange);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo userID={userID} />;
      case 'change-infor':
        return <ChangeInfor userID={userID} />;
      case 'orders':
        return <OrderHistory userID={userID} />;
      case 'become-seller':
        return <BecomeSeller userID={userID} setError={setError} />;
      default:
        return null;
    }
  };

  const handleSellerAccess = () => {
    // Kiểm tra và in ra dữ liệu `user` để xem nó có trong `localStorage` không
    const currentUser = JSON.parse(localStorage.getItem('user'));
    console.log("Current user from localStorage:", currentUser);

    // Đảm bảo currentUser có dữ liệu và chứa thuộc tính roles
    if (currentUser && currentUser.roles) {
      const currentRoles = currentUser.roles;
      console.log("Current roles:", currentRoles);

      // Kiểm tra nếu mảng roles chứa 'SELLER'
      if (currentRoles.includes('SELLER')) {
        navigate('/seller-dashboard');
      } else {
        setError("Bạn chưa đăng kí trở thành người bán.");
      }
    } else {
      setError("Dữ liệu người dùng không hợp lệ hoặc thiếu role.");
      console.log("User data is missing or does not contain roles.");
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="profile-layout">
          <aside className="sidebar-profile-page">
            <h2 className="sidebar-profile-title">Cài Đặt Tài Khoản</h2>
            <ul className="sidebar-menu">
              <li className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}>
                <a href="#profile" onClick={() => setActiveTab('profile')}>Thông tin cá nhân</a>
              </li>
              <li className={`menu-item ${activeTab === 'change-infor' ? 'active' : ''}`}>
                <a href="#change-infor" onClick={() => setActiveTab('change-infor')}>Thay đổi thông tin</a>
              </li>
              <li className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}>
                <a href="#orders" onClick={() => setActiveTab('orders')}>Đơn hàng của tôi</a>
              </li>
              <li className={`menu-item ${activeTab === 'become-seller' ? 'active' : ''}`}>
                <a href="#become-seller" onClick={() => setActiveTab('become-seller')}>Trở thành người bán hàng</a>
              </li>
              <li className={`menu-item ${activeTab === 'seller-dashboard' ? 'active' : ''}`}>
                <a href="#seller-dashboard" onClick={handleSellerAccess}>Trang quản lý người bán</a>
              </li>
            </ul>
          </aside>
          <section className="profile-content">
            {error && <p className="error-message">{error}</p>}
            {renderTabContent()}
          </section>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
