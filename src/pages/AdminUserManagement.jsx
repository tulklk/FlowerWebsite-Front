import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTachometerAlt, FaUsers, FaClipboardList, FaShoppingCart, FaBell } from 'react-icons/fa';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto'; 
import '../styles/AdminUserManagement.css';
import '../styles/popup.css';
import Navbar from "../components/Navbar.jsx";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [userStats, setUserStats] = useState({ total: 0, active: 0, blocked: 0 });
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  // const [blockedUsers, setBlockedUsers] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchPosts();
    fetchOrders();
    fetchData();
    fetchNotifications();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchUsers(), fetchPosts(), fetchOrders()]);
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      //Chart
      const response = await axios.get('http://localhost:8080/identity/users');
      const usersData = response.data.result;
      setUsers(usersData);
      const active = usersData.filter((user) => user.availableStatus === 'available').length;
      const blocked = usersData.filter((user) => user.availableStatus === 'blocked').length;
      //Bảnh thông số
      setTotalUsers(usersData.length);
      setActiveUsers(usersData.filter((user) => user.availableStatus === 'available').length);
      setUserStats({ total: usersData.length, active, blocked });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
 //Lấy dữ liệu bài post
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/identity/posts/');
      setPosts(response.data);
      setTotalPosts(response.data.length);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
//Lây dữ liệu order
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/identity/orders/');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  // hiện thông request seller
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8080/identity/noti/');
      const sellerRequests = response.data.filter(
        (noti) => noti.notificationType === 'setSeller'
      );
      console.log("Fetched notifications:", sellerRequests); 
      setNotifications(sellerRequests);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Xóa post
  const handleDeletePost = async (postID) => {
    try {
      await axios.delete(`http://localhost:8080/identity/posts/${postID}`);
      fetchPosts();
      setPopupMessage("Bài viết đã xóa thành công");
      setShowPopup(true);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  // Block người dùng
  const handleBlockUser = async (userID, isBlocked) => {
    try {
      const availableStatus = isBlocked ? 'available' : 'blocked'; // Đặt trạng thái dựa trên isBlocked
      await axios.put(`http://localhost:8080/identity/users/${userID}/status?status=${availableStatus}`);
      // setPopupMessage("Khóa thành công");
      // setShowPopup(true);
      fetchUsers();
    } catch (error) {
      console.error(`Error ${isBlocked ? 'unblocking' : 'blocking'} user:`, error);
    }
  };
  // Xóa người dùng
  const handleDeleteUser = async (userID) => {
    try {
      await axios.delete(`http://localhost:8080/identity/users/${userID}`);
      fetchUsers();
      setPopupMessage("Đã xóa tài khoản khách hàng thành công !");
      setShowPopup(true);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Xóa thông báo yêu cầu thành seller
  const handleDeleteNotification = async (notificationID) => {
    try {
      await axios.delete(`http://localhost:8080/identity/noti/${notificationID}`);
      setNotifications(notifications.filter((noti) => noti.notificationID !== notificationID));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  //Hàm để set Seller
  const handleSetSeller = async (userID) => {
    try {
      // Update the user's role to 'SELLER'
      await axios.put(`http://localhost:8080/identity/users/seller/${userID}`);
      
      // Update the users state to reflect the role change
      setUsers(users.map(user =>
        user.userID === userID ? { ...user, roles: [...user.roles, 'SELLER'] } : user
      ));
  
     
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser && currentUser.userID === userID) {
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          //Lấy tất cả các vai trò hiện tại của user
          roles: [...currentUser.roles, 'SELLER']
        }));
      }
  
      
      await axios.post('http://localhost:8080/identity/noti/', {
        content: "Bạn Đã Được Duyệt Thành Seller Thành Công!", 
        notificationType: "text",
        user: {
          userID: userID
        }
      });
  
  
      setPopupMessage("Đã cập nhật người dùng thành Seller thành công !");
      setShowPopup(true);
  
    } catch (error) {
      console.error('Error setting user as Seller:', error);
    }
  };

  //Tìm user
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Đang tải dữ liệu...</p>
      </div>
    );
  }


  const renderDashboard = () => {

    const pieData = {
      labels: ['Người dùng hoạt động', 'Người dùng bị khóa'],
      datasets: [
        {
          data: [userStats.active, userStats.blocked],
          backgroundColor: ['#4CAF50', '#FF5733'],
        },
      ],
    };

    // Bar Chart data for users and posts
    const barData = {
      labels: ['Tổng số người dùng', 'Tổng số bài viết'],
      datasets: [
        {
          label: 'Statistics',
          data: [userStats.total, totalPosts],
          backgroundColor: ['#36A2EB', '#FFCE56'],
        },
      ],
    };

    return (
      <div>

        <h2 className='admin-title'>Tổng quan</h2>
        <div className="dashboard">
          <div className="stat">
            <h3>Tổng số người dùng</h3>
            <p>{totalUsers}</p>
          </div>
          {/* <div className="stat">
                <h3>Người dùng hoạt động</h3>
                <p>{activeUsers}</p>
              </div> */}
          {/* <div className="stat">
                <h3>Người dùng bị khóa</h3>
                <p>{blockedUsers}</p>
              </div> */}
          <div className="stat">
            <h3>Tổng số bài viết</h3>
            <p>{totalPosts}</p>
          </div>
        </div>
        {/* <h2 className='admin-title'>Dashboard</h2> */}
        <div className="charts-container">
          <div className="chart">
            <h3>Bảng thông tin người dùng</h3>
            <Pie data={pieData} />
          </div>
          <div className="chart-colum">
            <h3>Tổng số người dùng và bài viết có trong trang web</h3>
            <Bar data={barData} />
          </div>
        </div>
      </div>
    );
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      // Add other case handlers for user list, posts, orders, as in your original code
      case 'userList':
        return (
          <div>
            <h2 className='admin-title'>Danh sách người dùng</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {filteredUsers.length > 0 ? (
              <table className="admin-user-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.userID}>
                      <td>{user.userID}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.roles.join(', ')}</td>
                      <td>
                        <button
                          className='button-block'
                          onClick={() => handleBlockUser(user.userID, user.availableStatus === 'blocked')}
                        >
                          {user.availableStatus === 'available' ? 'Khóa' : 'Bỏ khóa'}
                        </button>
                        <button
                          className='button-delete'
                          onClick={() => handleDeleteUser(user.userID)}
                        >
                          Xóa
                        </button>
                        {!user.roles.includes('SELLER') && (
                          <button
                            className='button-set-seller'
                            onClick={() => handleSetSeller(user.userID)}
                          >
                            Set Seller
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Không tìm thấy người dùng nào.</p>
            )}
          </div>
        );
      case 'post-setting':
        return (
          <div>
            <h2 className='admin-title'>Quản lý bài viết</h2>
            {posts.length > 0 ? (
              <table className="admin-user-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tiêu đề</th>
                    <th>Mô tả</th>
                    <th>Giá (VNĐ)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.postID}>
                      <td>{post.postID}</td>
                      <td>{post.title}</td>
                      <td>{post.description}</td>
                      <td>{post.price.toLocaleString()}</td>
                      <td>
                        <button className='button-delete' onClick={() => handleDeletePost(post.postID)}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Không có bài viết nào.</p>
            )}
          </div>
        );
      case 'order-management':
        return (
          <div>
            <h2 className='admin-title'>Quản lý đơn hàng</h2>
            {orders.length > 0 ? (
              <table className="admin-user-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Ngày</th>
                    <th>Tổng (VNĐ)</th>
                    <th>Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.orderID}>
                      <td>{order.orderID}</td>
                      <td>{order.user.username}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                      <td>{order.totalPrice.toLocaleString()}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Không có đơn hàng nào.</p>
            )}
          </div>
        );
      case 'seller-requests': // Make sure this case matches
        return (
          <div>
            <h2 className='admin-title'>Yêu cầu thành người bán hàng </h2>
            {notifications.length > 0 ? (
              <table className="admin-user-table">
                <thead>
                  <tr>
                    <th>Tên người dùng</th>
                    <th>Email</th>
                    <th>Ngày nhận đơn</th>
                    <th></th> 
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((noti) => (
                    <tr key={noti.notificationID}>
                      <td><strong>{noti.user.username}</strong></td>
                      <td>{noti.user.email}</td>
                      <td>{new Date(noti.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                      <td>
                        <button className="button-delete" onClick={() => handleDeleteNotification(noti.notificationID)}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <h3 className="request-seller">Không có yêu cầu thành người bán hàng.</h3>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="admin-panel">
      <Navbar />
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li onClick={() => setActiveTab('dashboard')}>
            <FaTachometerAlt className="icon" /> Dashboard Tổng quan
          </li>
          <li onClick={() => setActiveTab('userList')}>
            <FaUsers className="icon" /> Danh sách người dùng
          </li>
          <li onClick={() => setActiveTab('post-setting')}>
            <FaClipboardList className="icon" /> Quản lý Post
          </li>
          <li onClick={() => setActiveTab('order-management')}>
            <FaShoppingCart className="icon" /> Quản lý Đơn hàng
          </li>
          <li onClick={() => setActiveTab('seller-requests')}>
            <FaBell className="icon" /> Quản lí yêu cầu thành người bán hàng
            {/* {notifications.length > 0 && (
              <span className="seller-requests">{notifications.length}</span>
            )} */}
          </li>
        </ul>
      </div>
      {/* Main Content */}
      <div className="main-content">
        {renderContent()}
      </div>
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
              }}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );

};

export default AdminUserManagement;
