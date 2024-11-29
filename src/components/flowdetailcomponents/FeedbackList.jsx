import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./FeedbackList.css";

function FeedbackList({ flowerID }) { // Receive flowerID as a prop
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!flowerID) return;
    try {
      console.log("Fetching reviews for flowerID:", flowerID);
      const response = await axios.get(`http://localhost:8080/identity/reviews/flower/${flowerID}`);
      console.log("Full response:", response);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [flowerID]);

  useEffect(() => {
    if (flowerID) {
      fetchReviews();
    }
  }, [fetchReviews, flowerID]);

  const handleToggleShowAll = () => {
    setShowAll((prevShowAll) => !prevShowAll);
  };
  //hàm hiển thị số rating tương ứng với số sao
  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  return (
    <div className="feedback-section">
      <h3>Phản hồi từ khách hàng</h3>
      {reviews.length > 0 ? (
        <ul>
          {(showAll ? reviews : reviews.slice(0, 1)).map((review, index) => (
            <li key={index} className="feedback-item">
              <p><strong>{review.user?.username || "Khách hàng"}</strong> - {review.flowerBatch?.flowerName || "Sản phẩm"}</p>
              <p>Đánh giá: {renderStars(review.rating)}</p>
              <p>{review.comment}</p>
              <p><em>{new Date(review.createdAt).toLocaleDateString()}</em></p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Chưa có phản hồi nào.</p>
      )}
      {reviews.length > 1 && (
        <button onClick={handleToggleShowAll} className="see-more-btn">
          {showAll ? "Đóng" : "Xem thêm"}
        </button>
      )}
    </div>
  );
}

export default FeedbackList;
