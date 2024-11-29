import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/SuccessPage.css';
import useGetParams from '../hooks/useGetParams';
import axios from 'axios';

const SuccessPage = () => {
  const navigate = useNavigate();
  const getParams = useGetParams();
  const location = useLocation();
  const isCod = location.state?.isCod || false;

  const vnp_TxnRef = getParams("vnp_TxnRef");
  const vnp_ResponseCode = getParams("vnp_ResponseCode");
  const vnp_TransactionStatus = getParams("vnp_TransactionStatus");

  const updateOrderStatus = async () => {   
    try {
      await axios.post(`http://localhost:8080/identity/orders/payments/success?vnp_TxnRef=${vnp_TxnRef}&vnp_ResponseCode=${vnp_ResponseCode}&vnp_TransactionStatus=${vnp_TransactionStatus}`);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (vnp_TransactionStatus === "00") {
      // Handle COD success directly
      updateOrderStatus();
    } else if(isCod) {
      console.log("COD Payment Successful");
    } 
  }, [isCod, vnp_TxnRef, vnp_ResponseCode, vnp_TransactionStatus]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleTrackOrder = () => {
    navigate('/profile-page');
  };

  return (
    <div className="success-page">
      <div className="success-content">
        <h1>{isCod ? 'Đặt hàng thành công' : 'Thanh toán thành công'}</h1>
        <p>
          {isCod
            ? 'Đơn hàng của bạn đã được đặt thành công , đơn hàng của bạn sẽ được giao trong thời gian sớm nhất !'
            : 'Bạn đã thanh toán thành công, đơn hàng của bạn sẽ được giao trong thời gian sớm nhất !'}
        </p>
        <div className="success-icon">  
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" className="bi bi-check-circle-fill green-icon" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 10.97L4.47 8.47a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l5-5a.75.75 0 0 0-1.06-1.06L6.97 10.97z" />
          </svg>
        </div>
        <button className="go-home-btn" onClick={handleGoHome}>Quay về trang chủ</button>
        <button className="track-order-btn" onClick={handleTrackOrder}>Theo dõi đơn hàng của bạn</button>
      </div>
    </div>
  );
};

export default SuccessPage;
