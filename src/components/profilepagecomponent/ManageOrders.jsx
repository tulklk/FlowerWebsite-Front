// src/components/profilepagecomponent/ManageOrders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios for making API requests

const ManageOrders = ({ userID }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/identity/orders/`);
        setOrders(response.data); // Assuming the data is in the response.data
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders. Please try again.');
        setLoading(false);
      }
    };

    if (userID) {
      fetchOrders();
    }
  }, [userID]);

  if (loading) {
    return <p>Đang tải đơn hàng...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="manage-orders">
      <h2>Quản lý Đơn Hàng</h2>
      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã Đơn Hàng</th>
              <th>Trạng Thái</th>
              <th>Ngày Đặt</th>
              <th>Chi Tiết</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.orderID}</td>
                <td>{order.status}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>
                  <button>Xem Chi Tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageOrders;
