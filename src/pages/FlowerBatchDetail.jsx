import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from "axios";
import "../styles/FlowerBatchDetail.css";
import FeedbackList from '../components/flowdetailcomponents/FeedbackList.jsx';
import RelatedPosts from '../components/flowdetailcomponents/RelatedPosts.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/popup.css';
// import Navbar from "../components/Navbar.jsx";

function FlowerBatchDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [data, setData] = useState(null); // Dữ liệu cần làm mới

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);
  //hàm để tải dữ liệu
  const fetchData = async () => {
    setLoading(true);
    // Giả lập việc tải dữ liệu
    await new Promise(resolve => setTimeout(resolve, 1000));
    setData("New data loaded"); // Cập nhật dữ liệu mới
    setLoading(false);
  };

  // Tải dữ liệu lại khi component được mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchPost = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/identity/posts/${id}`);
      const postData = response.data;

      setPost(postData);
      setCurrentBatchIndex(0); 

  
      localStorage.setItem("postDetails", JSON.stringify(postData));
      console.log("Fetched post data:", postData);
    } catch (error) {
      setError("Lỗi khi lấy chi tiết lô hoa. Vui lòng thử lại.");
      console.error("Lỗi khi lấy chi tiết lô hoa: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (post && post.flowerBatches && post.flowerBatches[currentBatchIndex]) {
      fetchImage(post.flowerBatches[currentBatchIndex].flowerID);
    }
  }, [post, currentBatchIndex]);

  const fetchImage = async (flowerID) => {
    try {
      const response = await axios.get(`http://localhost:8080/identity/flowerImg/batch/${flowerID}/image`, {
        responseType: 'blob',
      });
      const imageUrl = URL.createObjectURL(response.data);
      setCurrentImage(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
      setCurrentImage(null);
    }
  };

  const goToPreviousBatch = () => {
    setCurrentBatchIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const goToNextBatch = () => {
    setCurrentBatchIndex((prevIndex) =>
      post.flowerBatches && prevIndex < post.flowerBatches.length - 1 ? prevIndex + 1 : prevIndex
    );
  };
//Hàm thêm hoa vào cart
const handleAddToCart = (currentBatch) => {
  if (!currentBatch) return;

  if (currentBatch.quantity <= 0) {
    setPopupMessage("Hoa loại này hiện đã hết hàng.");
    setShowPopup(true);
    return;
  }

  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const existingItem = cartItems.find(item => item.flowerID === currentBatch.flowerID);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      flowerID: currentBatch.flowerID,
      flowerName: currentBatch.flowerName,
      price: currentBatch.price,
      quantity: 1,
      imageUrl: currentBatch.imageUrl
    });
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  setPopupMessage("Sản phẩm đã được thêm vào giỏ hàng!");
  setShowPopup(true);
};

const handleAddAllEventFlowersToCart = () => {
  if (!post || !post.flowerBatches) return;

  let allOutOfStock = true;
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
 
  post.flowerBatches.forEach((batch) => {
    if (batch.quantity <= 0) return;

    allOutOfStock = false;
    if (batch.category?.eventName) {
      const existingItem = cartItems.find(item => item.flowerID === batch.flowerID);

      if (existingItem) {
        existingItem.quantity += batch.quantity;
      } else {
        cartItems.push({
          flowerID: batch.flowerID,
          flowerName: batch.flowerName,
          price: batch.price,
          quantity: batch.quantity
        });
      }
    }
  });

  if (allOutOfStock) {
    setPopupMessage("Tất cả các hoa loại này hiện đã hết hàng.");
    setShowPopup(true);
    return;
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  setPopupMessage("Tất cả các hoa trong sự kiện và số lượng tối đa của chúng đã được thêm vào giỏ hàng!");
  setShowPopup(true);
};


  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!post) {
    return <div className="error-message">Không tìm thấy bài viết.</div>;
  }

  const currentBatch = post.flowerBatches?.[currentBatchIndex];


  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        {/* <FlowerLoader />  */}
        <p className="loading-text">Đang tải dữ liệu...</p>
      </div>
    );
  }
  const handleClosePopup = () => {
    setLoading(true); // Bắt đầu hiển thị loading
    setTimeout(() => {
      setLoading(false); // Dừng loading sau 1 giây
      setShowPopup(false);
      window.location.replace(window.location.href);
    }, 1000); // Thời gian loading, có thể điều chỉnh
  };
  return (
    <div>
      {/* <Navbar/> */}
      <div className="breadcrumb-flower-detail">
        <Link to="/" className="home-link-breadcrumb-flower">Trang chủ</Link>
        <span> / </span>
        <Link to="/menu" className="home-link-breadcrumb-flower">Bài viết</Link>
        <span> / Chi tiết hoa trong bài post </span>
      </div>

      <div className="flower-detail-container">
        <div className="left-detail-flowerbatch">
          <img src={currentImage} alt={currentBatch?.flowerName || 'Flower'} className="image" />
        </div>

        <div className="right-detail-flowerbatch">
          {currentBatch ? (
            <div key={currentBatch.flowerID}>
              <h2>{currentBatch.flowerName}</h2>
              <p><strong>Giá:</strong> <span className="price">{currentBatch.price.toLocaleString()} VNĐ</span></p>
              <p>
                <strong>Sự kiện : </strong>
                <span className="event-name">
                  {currentBatch.category?.eventName === "Không" ? "Hoa bán theo bó" : currentBatch.category?.eventName || "Không có sự kiện"}
                </span>
              </p>
              <p>
                <strong>Số lượng còn lại: </strong>
                <span className="quantity in-stock">
                  {currentBatch.quantity > 0 ? `${currentBatch.quantity} bó` : 'Hết hàng'}
                </span>
              </p>
              <p><strong>Mô tả hoa : </strong><span className="flower-description">{currentBatch.description}</span></p>
            </div>
          ) : (
            <p>Không có thông tin về lô hoa.</p>
          )}

          <div className="star-rating">
            <p><strong>Đánh giá: </strong><span className="stars">⭐⭐⭐⭐⭐</span></p>
          </div>

          <div className="pagination-controls">
            <button onClick={goToPreviousBatch} disabled={currentBatchIndex === 0}>Trước</button>
            <span>Lô hoa {currentBatchIndex + 1} / {post.flowerBatches?.length || 0}</span>
            <button onClick={goToNextBatch} disabled={currentBatchIndex >= (post.flowerBatches?.length || 0) - 1}>Sau</button>
          </div>

          <div className="button-container-post-detail">
            <button className="add-cart-button-detail" onClick={() => handleAddToCart(currentBatch)}>Thêm vào giỏ hàng</button>
            <button className="buy-all-event-flowers-button" onClick={handleAddAllEventFlowersToCart}>
              Thêm tất cả các hoa trong sự kiện
            </button>
          </div>
        </div>
      </div>
   {/*Phần Feedback của khách hàng mua hoa*/}
      <div className="feedback-section">
        {currentBatch && <FeedbackList flowerID={currentBatch.flowerID} />}
      </div>
    {/* Các bài viết có liên quan */}
      <div className="related-posts-section">
        <RelatedPosts currentProductId={id} />
      </div>
      <Footer />
      {// Hiển thị thông báo popup
      }
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-icon">✅</div>
            <h2>Thông báo</h2>
            <p className="popup-message">{popupMessage}</p>
            <button
              className="close-button-popup"
              onClick={handleClosePopup}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlowerBatchDetail;
