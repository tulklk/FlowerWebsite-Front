import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Cart.css';
import Footer from '../components/Footer';
import '../styles/popup.css';
import Navbar from "../components/Navbar.jsx";
import axios from 'axios';

const Cart = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [imageUrls, setImageUrls] = useState({});

  // Lấy ảnh image từ sever đã create bên create flower và ảnh sẽ đính kèm với flowerID
  const fetchImage = async (flowerID) => {
    try {
      const response = await axios.get(`http://localhost:8080/identity/flowerImg/batch/${flowerID}/image`, {
        responseType: 'blob', 
      });
      const imageUrl = URL.createObjectURL(response.data);
      setImageUrls((prev) => ({ ...prev, [flowerID]: imageUrl }));
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  // Láy ảnh cho tất cả các sản phẩm có trong cart
  useEffect(() => {
    cartItems.forEach(item => fetchImage(item.flowerID));
  }, [cartItems]);
//Hàm thay đổi số lượng
  const handleQuantityChange = async (id, delta) => {
    const updatedItems = cartItems.map((item) =>
      item.flowerID === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    setCartItems(updatedItems);
  };
//Hàm nhập số lượng (tối thiểu là 1 )
  const handleQuantityInputChange = (id, value) => {
    const updatedItems = cartItems.map((item) =>
      item.flowerID === id ? { ...item, quantity: Math.max(1, parseInt(value) || 1) } : item
    );
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    setCartItems(updatedItems);
  };
//Hàm xóa các sản phẩm có  trong cart
  const handleDelete = (id) => {
    const updatedItems = cartItems.filter((item) => item.flowerID !== id);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    setCartItems(updatedItems);
  };
  console.log(cartItems);
//Tính tổng tiền sản phẩm trong giỏ
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
//Hàm thanh toán, chuyển sang trang checkout, nếu chưa đăng nhập sẽ bắt đăng nhập
  const handlePurchase = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setPopupMessage("Bạn cần đăng nhập để tiếp tục!");
      setShowPopup(true);
    } else if (cartItems.length === 0) {
      setSuccessMessage("Giỏ hàng trống, vui lòng thêm sản phẩm!");
    } else {
      navigate('/checkout', { state: { cartItems, totalPrice } });
      setCartItems([]);
    }
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Đang tải dữ liệu...</p>
      </div>
    );
  }
  return (
    <div className="cart-page">
    {/* <Navbar/> */}
      <div className="cart-header">
        <h2 className='cart-title'>Giỏ Hàng</h2>
      </div>
      <div className="cart-content">
        {cartItems.length === 0 ? (
          <p className="empty-cart-message">Giỏ hàng của bạn trống</p>
        ) : (
          <table className="cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Hình ảnh</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Tổng cộng</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.flowerID}>
                  <td>{item.flowerName}</td>
                  <td>
                    <img 
                      src={imageUrls[item.flowerID] || 'default-image-url'} 
                      alt="Product" 
                      className="cart-image" 
                    />
                  </td>
                  <td>{item.price.toLocaleString()} VNĐ</td>
                  <td>
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.flowerID, -1)}>-</button>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => handleQuantityInputChange(item.flowerID, e.target.value)}
                      className="quantity-input" 
                      min="1"
                    />
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.flowerID, 1)}>+</button>
                  </td>
                  <td>{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)} VNĐ</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDelete(item.flowerID)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="cart-footer">
        <p className="total-price">
          Tổng thanh toán ({cartItems.length} sản phẩm): {totalPrice.toLocaleString()} VNĐ
        </p>
        <button className="purchase-button" onClick={handlePurchase}>Mua Hàng</button>
        {successMessage && <p className="cart-message">{successMessage}</p>}
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-icon">❌</div>
            <h2>Thông báo</h2>
            <p className="popup-message">{popupMessage}</p>
            <button
              className="close-button-popup"
              onClick={() => {
                setShowPopup(false);
                navigate("/login");
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Cart;
