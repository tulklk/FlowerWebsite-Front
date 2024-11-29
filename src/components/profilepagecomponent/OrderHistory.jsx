import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderHistory.css';
import { useNavigate } from 'react-router-dom';
const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("orderInfo");
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/identity/orders/user/${user.userID}`);
        setOrders(response.data || []);
        localStorage.setItem('orderHistory', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching order history:', error);
        setOrders([]);
      }
    };

    fetchOrderHistory();
  }, [user.userID]);

  const viewOrderDetails = async (orderID) => {
    try {
      const response = await axios.get(`http://localhost:8080/identity/order-details/by-order/${orderID}`);
      setSelectedOrderDetails(response.data);
      localStorage.setItem('orderHistoryDetail', JSON.stringify(response.data));
      console.log("Order History Detail:", JSON.parse(localStorage.getItem('orderHistoryDetail')));
      setModalVisible(true);
      setActiveTab("orderInfo");
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrderDetails(null);
  };

  const switchTab = (tab) => setActiveTab(tab);

  return (
    <div className="order-history">
      <h2>Lịch Sử Đơn Hàng</h2>
      <div className="order-history">
        {orders.length > 0 ? (
          <div className="order-history-grid">
            {orders.map((order) => (
              <div key={order.orderID} className="order-item">
                <div className="orders-history">
                  <h3>Đơn hàng #{order.orderID}</h3>
                  <p className="order-total">{order.totalPrice.toLocaleString()} VNĐ</p>
                  <p>Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
                  <p>Tình trạng đơn hàng : {order.status}</p>
                  <button className="view-details" onClick={() => viewOrderDetails(order.orderID)}>Xem chi tiết</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Không có đơn hàng nào</p>
        )}
      </div>


      {isModalVisible && (
        <>
          <div className="overlay" onClick={closeModal}></div>
          <div className="order-detail">
            <span className="close-btn" onClick={closeModal}>×</span>
            <div className="tab-menu">
              <button onClick={() => switchTab("orderInfo")} className={activeTab === "orderInfo" ? "active" : ""}>Thông Tin Đơn Hàng</button>
              <button onClick={() => switchTab("productDetails")} className={activeTab === "productDetails" ? "active" : ""}>Chi Tiết Sản Phẩm</button>
              <button onClick={() => switchTab("deliveryInfo")} className={activeTab === "deliveryInfo" ? "active" : ""}>Thông Tin Giao Hàng</button>
            </div>

            {/* Tab Thông Tin Đơn Hàng */}
            <div className={`tab-content ${activeTab === "orderInfo" ? "active" : ""}`}>
              <h3 className="order-history-title">Thông Tin Đơn Hàng</h3>
              {selectedOrderDetails && (
                <table className="order-info-table">
                  <tbody>
                    <tr className="order-id-row">
                      <td className="label">Mã đơn hàng</td>
                      <td className="value">{selectedOrderDetails[0]?.order?.orderID}</td>
                    </tr>
                    <tr className="order-date-row">
                      <td className="label">Ngày đặt</td>
                      <td className="value">
                        {selectedOrderDetails[0]?.order?.orderDate
                          ? new Date(selectedOrderDetails[0]?.order?.orderDate).toLocaleDateString('vi-VN')
                          : "N/A"}
                      </td>
                    </tr>
                    <tr className="total-price-row">
                      <td className="label">Tổng cộng</td>
                      <td className="value">{selectedOrderDetails[0]?.order?.totalPrice?.toLocaleString() || "0"} VNĐ</td>
                    </tr>
                    <tr className="payment-method-row">
                      <td className="label">Phương thức thanh toán</td>
                      <td className="value">{selectedOrderDetails[0]?.payment?.method || "N/A"}</td>
                    </tr>
                    <tr className="shipping-address-row">
                      <td className="label">Địa chỉ giao hàng</td>
                      <td className="value">{selectedOrderDetails[0]?.order?.shippingAddress || "N/A"}</td>
                    </tr>
                    <tr className="status-row">
                      <td className="label">Trạng thái</td>
                      <td className="value">{selectedOrderDetails[0]?.order?.status || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>


            {/* Tab Chi Tiết Sản Phẩm */}
            <div className={`tab-content ${activeTab === "productDetails" ? "active" : ""}`}>
              <h3 className='order-history-title'>Chi Tiết Sản Phẩm</h3>
              {selectedOrderDetails && (
                <div className="order-flower-details">
                  {selectedOrderDetails.map((detail, index) => (
                    <div key={index} className="product-detail">
                      <table className="flower-detail-table">
                        <thead>
                          <tr>
                            <th>Sản phẩm</th>
                            <th>Loại hoa</th>
                            <th>Số lượng</th>
                            <th>Giá đơn vị</th>
                            <th>Tổng tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detail.flowerBatchesWithQuantity.map((batch, idx) => (
                            <tr key={idx} className="flower-detail-row">
                              <td className="flower-name">{batch.flowerBatch?.flowerName || "N/A"}</td>
                              <td className="flower-type">{batch.flowerBatch?.category?.flowerType || "N/A"}</td>
                              <td className="flower-quantity">{batch.orderQuantity || "0"}</td>
                              <td className="flower-unit-price">{batch.flowerBatch?.price?.toLocaleString() || "0"} VNĐ</td>
                              <td className="flower-total-price">{((batch.orderQuantity || 0) * (batch.flowerBatch?.price || 0)).toLocaleString() || "0"}₫</td>
                              {/* <td className="flower-status">{batch.flowerBatch?.status || "N/A"}</td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>

                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Tab Thông Tin Giao Hàng */}
            <div className={`tab-content ${activeTab === "deliveryInfo" ? "active" : ""}`}>
              <h3 className='order-history-title'>Thông Tin Giao Hàng</h3>
              {selectedOrderDetails && (
                <div className="delivery-info">
                  <p className="order-history-deli"><strong>Ngày giao hàng dự kiến:</strong> {selectedOrderDetails[0]?.delivery?.deliveryDate ? new Date(selectedOrderDetails[0]?.delivery?.deliveryDate).toLocaleDateString('vi-VN') : "N/A"}</p>

                  <p className="order-history-deli">
                    <strong>Trạng thái giao hàng : </strong>
                    {selectedOrderDetails[0]?.delivery?.availableStatus === "Delivered"
                      ? "Đơn hàng của bạn đã giao thành công. Vui lòng nhấn nút bên dưới để xác nhận đơn hàng và review sản phẩm !"
                      : selectedOrderDetails[0]?.delivery?.availableStatus || "N/A"}
                  </p>

                  {/* Hiển thị nút nếu trạng thái là "Delivered" */}
                  {selectedOrderDetails[0]?.delivery?.availableStatus === "Delivered" && (
                    <button
                      className="review-button"
                      onClick={() => navigate(`/review/${selectedOrderDetails[0]?.order?.orderID}`)}
                    >
                      Xác nhận đơn hàng và review
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>

  );
};

export default OrderHistory;
