import React, { useState, useEffect } from "react";
import axios from 'axios';
import './ManageSellerOrders.css';

const ManageSellerOrders = ({ userID }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('orderDetails');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/identity/order-details/orders-by-seller/${userID}`);
        setOrders(response.data);
      } catch (err) {
        setError("Không thể tải dữ liệu đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userID]);

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
    setActiveTab('orderDetails');
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const updateDeliveryStatus = async () => {
    if (!selectedOrder) return;
    const { deliveryID } = selectedOrder.delivery;

    try {
      const response = await axios.patch(`http://localhost:8080/identity/delivery/status/${deliveryID}`, {
        availableStatus: "Delivered"
      });

      // Cập nhật trạng thái của đơn hàng đã chọn
      setSelectedOrder((prevOrder) => ({
        ...prevOrder,
        delivery: {
          ...prevOrder.delivery,
          availableStatus: response.data.availableStatus
        }
      }));

      console.log('Trạng thái đơn hàng đã cập nhật:', response.data);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader-spinner"></div>
        <p className="loader-text">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="seller-orders-container">
      <h3 className="orders-title">Danh sách đơn hàng của người mua</h3>
      {error && <p className="error-text">{error}</p>}
      <div className="orders-list">
        {orders.map((orderItem) => (
          <div className="order-card" key={orderItem.order.orderID}>
            <div className="order-info">
              <h3 className="order-id">Đơn Hàng #{orderItem.order.orderID}</h3>
              <p className="order-date">Ngày đặt : {new Date(orderItem.order.orderDate).toLocaleDateString('vi-VN')}</p>
              <p className="order-address">Địa chỉ : {orderItem.order.shippingAddress}</p>
              <p className="order-total">Tổng giá : {orderItem.order.totalPrice.toLocaleString()} VND</p>
              <p className="order-status-text">Trạng thái : {orderItem.order.status}</p>
              <p className="buyer-name">Người mua : {orderItem.order.user.username}</p>
              <button className="details-button" onClick={() => viewOrderDetails(orderItem)}>Xem Chi Tiết</button>
            </div>
          </div>
        ))}
      </div>

      {isModalVisible && selectedOrder && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="order-modal">
            <span className="close-modal-button" onClick={closeModal}>×</span>

            <div className="modal-tabs">
              <button
                className={`tab-button ${activeTab === 'orderDetails' ? 'active' : ''}`}
                onClick={() => setActiveTab('orderDetails')}
              >
                Chi tiết đơn hàng
              </button>
              <button
                className={`tab-button ${activeTab === 'productDetails' ? 'active' : ''}`}
                onClick={() => setActiveTab('productDetails')}
              >
                Thông tin sản phẩm
              </button>
              <button
                className={`tab-button ${activeTab === 'deliveryDetails' ? 'active' : ''}`}
                onClick={() => setActiveTab('deliveryDetails')}
              >
                Thông tin vận chuyển
              </button>
            </div>

            {activeTab === 'orderDetails' && (
              <div className="order-details-content">
                <h2 className="modal-title">Chi Tiết Đơn Hàng</h2>
                <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.order.orderDate).toLocaleDateString('vi-VN')}</p>
                {/* <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.order.shippingAddress}</p> */}
                <p><strong>Người mua:</strong> {selectedOrder.order.user.username}</p>
                <p><strong>Email người mua:</strong> {selectedOrder.order.user.email}</p>
                <p><strong>Phương thức thanh toán:</strong> {selectedOrder.payment.method}</p>
              </div>
            )}

            {activeTab === 'productDetails' && (
              <div className="product-details-content">
                <h2 className="modal-title">Chi Tiết Sản Phẩm</h2>
                {selectedOrder.flowerBatchesWithQuantity?.map((item, index) => (
                  <div key={index} className="product-details">
                    <p><strong>Sản phẩm:</strong> {item.flowerBatch.flowerName}</p>
                    <p><strong>Số lượng:</strong> {item.orderQuantity}</p>
                    <p><strong>Giá:</strong> {item.flowerBatch.price.toLocaleString()} VND</p>
                    <p><strong>Thành tiền:</strong> {(item.orderQuantity * item.flowerBatch.price).toLocaleString()} VND</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'deliveryDetails' && (
              <div className="delivery-details-content">
                <p><strong>Mã đơn hàng #</strong>{selectedOrder.delivery.deliveryID}</p>
                {/* <p><strong>Trạng Thái Giao Hàng:</strong> {selectedOrder.delivery.availableStatus}</p> */}
                <p className="order-address">Địa chỉ : {selectedOrder.order.shippingAddress}</p>
                <p><strong>Ngày Giao Dự Kiến:</strong> {new Date(selectedOrder.delivery.deliveryDate).toLocaleDateString('vi-VN')}</p>

                <button
                  className="update-status-button"
                  onClick={updateDeliveryStatus}
                  disabled={selectedOrder.delivery.availableStatus === 'Delivered'}
                >
                  {selectedOrder.delivery.availableStatus === 'Delivered' ? 'Đã Giao' : 'Cập Nhật Trạng Thái'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageSellerOrders;
