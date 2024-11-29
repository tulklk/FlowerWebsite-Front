import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import Logo from '../assets/Flower.png';
import { FaUser, FaShoppingBag, FaSignOutAlt, FaBell } from 'react-icons/fa';
import axios from 'axios';

function Navbar({ cartCount }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);


  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Gọi API lấy thông báo theo userID
        if (parsedUser.userID) {
          axios
            .get(`http://localhost:8080/identity/noti/user/${parsedUser.userID}`)
            .then((response) => {
              const userNotifications = response.data;
              setNotifications(userNotifications);
              if (userNotifications.length > 0) setHasNewNotifications(true);
            })
            .catch((error) => console.error('Lỗi khi lấy thông báo:', error));
        }
      } catch (error) {
        console.error("Lỗi khi phân tích dữ liệu người dùng:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/identity/posts/')
      .then((response) => setPosts(response.data))
      .catch((error) => console.error('Lỗi khi lấy bài viết:', error));
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setSearchResults(
      value ? posts.filter(post =>
        post.title.toLowerCase().includes(value) || post.content?.toLowerCase().includes(value)
      ) : []
    );
  };

  const toggleNotificationPanel = () => {
    setShowNotificationPanel((prev) => !prev);
    if (hasNewNotifications) setHasNewNotifications(false);
  };

  useEffect(() => {
    if (showNotificationPanel) {
      const timer = setTimeout(() => setShowNotificationPanel(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotificationPanel]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={Logo} alt="Logo" className="navbar-logo" />
      </div>

      <div className="navbar-center">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Trang chủ</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Giới thiệu</NavLink>
        <NavLink to="/menu" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Bài viết</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Feedback</NavLink>
        <NavLink to="/blog-page" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Blog</NavLink>
      </div>

      <div className="navbar-right">
        <div className="search-bar-wrapper">
          <input
            type="text"
            className="search-bar-nav"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((post) => (
                <Link to={`/menu`} key={post.id} className="search-result-item">
                  <h4>{post.title}</h4>
                  <p>{post.content ? post.content.substring(0, 100) : 'No content available'}...</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <>
            <div className="navbar-infor" onClick={toggleDropdown}>
              <span className="navbar-user">Xin chào, {user.username || 'User'}</span>
              {/* <FaUser className="navbar-icon" /> */}
            </div>

            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  <Link
                    to={user?.roles?.includes('ADMIN') ? '/admin-user-management' : '/profile-page'}
                    className="account-link-nav"
                  >
                    <FaUser className="navbar-icon-dropdown" style={{ marginRight: '8px' }} />
                    Thông tin tài khoản
                  </Link>
                </div>

                <div className="dropdown-item" onClick={handleLogout}>
                  <FaSignOutAlt className="dropdown-icon" /> Đăng xuất
                </div>
              </div>
            )}
          </>
        ) : (
          <Link to="/login">
            <FaUser className="navbar-icon" />
          </Link>
        )}

        <div className="cart-icon-wrapper">
          <Link to="/cart">
            <FaShoppingBag className="navbar-icon" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>

        {/* Notification bell */}
        <div className="notification-icon-wrapper" onClick={toggleNotificationPanel} ref={notificationRef}>
          <FaBell className="navbar-icon" />
          {hasNewNotifications && <span className="notification-dot"></span>}
          {showNotificationPanel && (
            <div className="notification-panel">
              <h4>Thông báo</h4>
              <ul>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li key={notification.id}>{notification.content}</li>
                  ))
                ) : (
                  <li>Không có thông báo nào</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
